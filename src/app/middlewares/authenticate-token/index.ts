import jwt from 'jsonwebtoken'
import { $AuthErrorEnum, $JwtUserInterface } from '../../models/refresh-token/refresh-token.dto';
import loadEnv from '../../services/env';

const env = loadEnv()
/**
 * This middleware will authenticate user.
 * @param req 
 * @param res 
 * @param next 
 */
export default function authenticateToken(req:any, res:any, next:any){
    const token = req.headers.authorization;
    if(!token) return res.status(401).json([$AuthErrorEnum.UNAUTHORIZED]);
    jwt.verify(token, env.ACCESS_TOKEN_SECRET,(err:any,user:any)=>{
        if(err) return res.status(403).json([$AuthErrorEnum.INVALID_AUTH_TOKEN]);
        req.user = user as $JwtUserInterface;
        next()
    })
}