import express from 'express'
import {wrapper} from '../../../models/index'
import jwt from 'jsonwebtoken';
import loadEnv from '../../../services/env';
import { $AuthErrorEnum } from '../../../models/refresh-token/refresh-token.dto';

const route = express.Router();
const env = loadEnv()

/**
 * Routes definitions
 */
route.post('/refresh',refreshAuthTokenByRefreshToken);

/**
 * Will create a new auth token from a given refresh token
 * @param req Request
 * @param res Response
 * @returns Response Body
 */
async function refreshAuthTokenByRefreshToken(req:any, res:any){
    const TokenWrapper = new wrapper.token()
    const refreshToken = req.body.refreshToken;
    /** Check token validity */
    if(!refreshToken) return res.status(401).json($AuthErrorEnum.INVALID_REFRESH_TOKEN)
    const exists = await TokenWrapper.find({refreshToken:refreshToken})
    if(!exists) return res.status(403).json([$AuthErrorEnum.INVALID_REFRESH_TOKEN])
    /** Authenticate Token */
    jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET,(err:any,user:any)=>{
        if(err) return res.status(403).json($AuthErrorEnum.INVALID_REFRESH_TOKEN)
        const accessToken = TokenWrapper.generateAccessToken({_id:user._id,email:user.email});
        return res.status(200).json(Object.freeze({accessToken:accessToken, refreshToken:refreshToken}))
    })
}

export default route;