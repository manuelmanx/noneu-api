import express from 'express'
import crypto from '../../../helpers/crypto';
import authenticateToken from '../../../middlewares/authenticate-token';
import {wrapper} from '../../../models/index'
import { $UserValidationErrorsEnum } from '../../../models/user/user.dto';
import loadEnv from '../../../services/env';
import {sendSimpleEmail } from '../../../services/smtp';
import { $SmtpEmailsCustomIds } from '../../../services/smtp/smtp.dto';
import { buildEmailHtmlContext } from '../../../statics';

const route = express.Router();
const env = loadEnv()

/**
 * Routes definitions
 */
route.post('/change', authenticateToken, changePasswordWithAuthToken)
route.post('/recover',askForPasswordRecoveryPin)

/**
 * Will change the password for authorized users
 * @param req Request
 * @param res Response
 * @returns Response Body
 */
async function changePasswordWithAuthToken(req:any, res:any){
    const UserWrapper = new wrapper.user();
    const {password} = req.body;
    const uid = (req as any)?.user?._id;
    /** Validity Check */
    const valid = await UserWrapper.$isPasswordChangeUserByEmailFormValid({password:password}, uid);
    if (!valid.valid) return res.status(400).json(valid.errors);
    /** Update Password */
    const updated = await UserWrapper.updatePassword({_id:uid}, password);
    if(!await crypto().compare(password,updated?.password||'')){
        return res.status(400).json([$UserValidationErrorsEnum.PASSWORD_NOT_CHANGED]);
    }
    /** Response */
    return res.status(200).json([$UserValidationErrorsEnum.SUCCESS]);
}

/**
 * Will create a temporary recovery pin to login and change the password
 * @param req Request
 * @param res Response
 * @returns Response Body
 */
async function askForPasswordRecoveryPin(req:any, res:any){
    const UserWrapper = new wrapper.user();
    const {email} = req.body;
    /** Validity Check */
    const user = await UserWrapper.find({email:email})
    const valid = await UserWrapper.$isPasswordRecoveryUserByEmailFormValid(email);
    if (!valid.valid) return res.status(400).json(valid.errors);
    /** Create recovery pin */
    const pin = await UserWrapper.createRecoveryPassworPin(email);
    /** Create HTML template */
    const html:string = await buildEmailHtmlContext('password-recovery.html',{username:`${user?.firstName} ${user?.lastName}`, pin:pin});
    /** Send the email */
    sendSimpleEmail(env.NOREPLY_EMAIL, html, "Password Reset Request", email, $SmtpEmailsCustomIds.PASSWORD_RECOVER).then(success=>{
        res.status(200).json(["EMAIL_SENT"]);
    }).catch(e=>{
        res.status(e.status);
    })
}

export default route;