import express from 'express'
import crypto from '../../../helpers/crypto';
import regex from '../../../helpers/regex';
import {wrapper} from '../../../models/index'
import { $UserValidationErrorsEnum } from '../../../models/user/user.dto';
import loadEnv from '../../../services/env';
import { sendSimpleEmail } from '../../../services/smtp';
import { $SmtpEmailsCustomIds } from '../../../services/smtp/smtp.dto';
import { buildEmailHtmlContext, buildPageHtmlContext } from '../../../statics';

const route = express.Router()
const env = loadEnv()

/**
 * Routes definitions
 */
route.post('/email',createUserWithEmailAndPassword)
route.get('/verification/:email',verifyEmailAddress)

/**
 * This function will make you able to create a new user
 * @param req Request
 * @param res Response
 * @returns Response Body
 */
async function createUserWithEmailAndPassword(req:any, res:any){
    /** Load the wrapper class */
    const UserWrapper = new wrapper.user();
    /** Load the data from body request */
    const data = req.body;
    /** Check the validity of the body request */
    const valid = await UserWrapper.$isRegisterUserByEmailFormValid(data)
    /** if the body is not valid, return errors list */
    if(!valid.valid) return res.status(400).json(valid.errors);
    /** ask to the wrapper to create a new user */
    const user = await UserWrapper.create(data);
    /** delete password from response for major security */
    delete user?.password;
    /** send the user object successfully created */
    const url = `${env.APP_PUBLIC_URL}/auth/signup/verification/${crypto().b64encode(user?.email||'')}`;
    /** Compose html string */
    const html:string = await buildEmailHtmlContext('address-verification.html',{username:`${user?.firstName} ${user?.lastName}`, url:url});
    /** Send the email to verify account */
    sendSimpleEmail(env.NOREPLY_EMAIL, html, "Email Verification", user?.email||'', $SmtpEmailsCustomIds.VERIFY_ACCOUNT).then(success=>{
        return res.status(201).json(user);
    }).catch(e=>{
        res.status(e.status);
    })
}

/**
 * This function will verify the email address of a new user.
 * @param req Request
 * @param res Response
 * @returns Response Body
 */
async function verifyEmailAddress(req:any, res:any){
    const UserWrapper = new wrapper.user();
    const encodedEmail = req.params.email;
    /** decode b64 email */
    const email = crypto().b64decode(encodedEmail);
    /** check email validy*/
    if(!email || !regex().isEmailValid(email)) return res.status(400).json([$UserValidationErrorsEnum.INVALID_EMAIL]);
    /** Check if email has been already verified */
    const user = await UserWrapper.find({email:email});
    if(user?.emailVerified){
        const html  = await buildPageHtmlContext('email-verification-error.html', {error:"Already Verified"});
        /** Send the error response */
        return res.send(html);
    }
    /** update validity to true */
    const updatedUser = await UserWrapper.update({email:email},{emailVerified:true});
    /** Check if user has been update */
    if(!updatedUser){
        const html  = await buildPageHtmlContext('email-verification-error.html', {error:"User not found"});
        /** Send the error response */
        return res.send(html);
    } 
    /** Send the success response */
    const html = await buildPageHtmlContext('email-verification-success.html', {});
    return res.send(html);
}
export default route;