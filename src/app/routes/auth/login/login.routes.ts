import express from 'express';
import {wrapper} from '../../../models/index';
import jwt from 'jsonwebtoken';
import loadEnv from '../../../services/env';
import { $JwtUserInterface } from '../../../models/refresh-token/refresh-token.dto';

const route = express.Router();
const env  = loadEnv();

/**
 * Routes definitions
 */
route.post('/email',loginUserWithEmailAndPassword)

/**
 * Will authenticate user with email and password
 * @param req Request
 * @param res Response
 * @returns Response Body
 */
async function loginUserWithEmailAndPassword(req:any, res:any){
     /** Define the wrappers */
     const UserWrapper = new wrapper.user();
     const TokenWrapper = new wrapper.token();
     /** Load the data from body request */
     const data = req.body;
     /** Validate body data model */
     const valid = await UserWrapper.$isLoginUserByEmailFormValid(data)
     if(!valid.valid) return res.status(400).json(valid.errors);
     /** Retrive user */
     const user = await UserWrapper.find({email:data?.email});
     const mustChangePassword = !!user?.pwResetPin;
     /** Delete the secret parameters */
     delete user?.password;
     delete user?.pwResetPin;
     const jwtUser = {email:user?.email, _id:user?._id} as $JwtUserInterface;
     /** Manage jwt auth tokens */
     const accessToken = TokenWrapper.generateAccessToken(jwtUser)
     /** Update the user refresh token */
     const refreshToken =  await TokenWrapper.updateRefreshToken(jwtUser, user?._id||'')
     /** Build the response object */
     const response = Object.freeze({...user,...{accessToken:accessToken, refreshToken:refreshToken,mustChangePassword:mustChangePassword}})
     return res.status(200).json(response);
}
export default route;