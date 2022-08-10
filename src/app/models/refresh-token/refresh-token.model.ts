import { getCollections } from "../../services/db";
import { $JwtUserInterface, $RefreshTokenModelInterface } from "./refresh-token.dto";
import jwt from 'jsonwebtoken';
import loadEnv from "../../services/env";

const env = loadEnv()

class RefreshTokenModel{
    public _id?:string;
    public refreshToken?:string;
    public uid?:string;
    constructor(
        data:$RefreshTokenModelInterface
    ){
        /**
         * Assign data to the class items.
         */
        Object.assign(this, data);
    }
}

export default class RefreshTokenWrapper{
    constructor(
        /**
         * Load the collection
         */
        private _collection = getCollections().refreshToken
    ){
        /**
         * Catch the collections errors
         */
        if (!this._collection) {
            throw new Error ("Unable to get the collection for UserClient");
        }
    }
    /**
     * Create new refresh token on db
     * @param data 
     * @returns 
     */
    public async create(data:$RefreshTokenModelInterface){
        const success = await this._collection?.create(data);
        return this.find({_id:success._id});
    }
    /**
     * Find method
     * It will find a token and return it
     * @param token 
     * @returns 
     */
    public async find(filter:Partial<$RefreshTokenModelInterface>){
        const object = await this._collection?.find(filter);
        if(!object) return null;
        const data = new RefreshTokenModel(object)
        return data;
    }
    /**
     * Update the token
     * @param token
     * @param newToken 
     * @returns 
     */
    public async update(filter:Partial<$RefreshTokenModelInterface>, newToken:string){
        const object = await this._collection?.update(filter, {refreshToken: newToken});
        const newObject = await this.find(filter);
        if(!newObject) return null;
        return newObject;
    }
    /**
     * Generate new access token
     * @param user The user jwt to authenticate
     * @returns new Access Token
     */
    public generateAccessToken(user:$JwtUserInterface){
        return jwt.sign(user, env.ACCESS_TOKEN_SECRET, {expiresIn:'15m'});
    }
    /**
     * Generate new refresh token
     * @param user The user jwt to authenticate
     * @returns new refresh Token
     */
    public generateRefreshToken(user:$JwtUserInterface){
        return jwt.sign(user, env.REFRESH_TOKEN_SECRET);
    }

    /**
     * Update the refresh token on new login request.
     * @param user the user to authenticate with JWT
     * @param uid the uid of the user to update Refresh token
     * @returns the new refresh Token
     */
    public async updateRefreshToken(user:$JwtUserInterface, uid:string){
        const exist = await this.find({uid:uid})
        const newRefreshToken = this.generateRefreshToken(user)
        if(!exist){
            const success = await this.create({uid:uid, refreshToken:newRefreshToken})
            return success?.refreshToken;
        }
        const update = await this.update({uid:uid},newRefreshToken)
        return update?.refreshToken;
    }
}