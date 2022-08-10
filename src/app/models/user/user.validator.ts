import { $UserModelCreateInterface, $UserModelInterface, $UserValidationErrorsEnum } from "./user.dto";
import regex from "../../helpers/regex";
import { $ValidationResponse } from "..";

export default function userValidator(){
    return Object.freeze({
        registerUserByEmailForm:registerUserByEmailForm,
        loginUserByEmailForm:loginUserByEmailForm,
        passwordChangeUserByEmailForm:passwordChangeUserByEmailForm,
        passwordRecoveryUserByEmailForm:passwordRecoveryUserByEmailForm
    })
    /**
     * Will check if user fields are right.
     * @param data the user data from create user request
     * @returns if is data valid and the list of errors.
     */
    function registerUserByEmailForm(data:$UserModelCreateInterface):$ValidationResponse{
        const e:$UserValidationErrorsEnum[] = [];
        const {
            password,
            username,
            firstName,
            lastName,
            email} = data;
        /**
         * For each field check if it is valid or not.
         */
        if(!password) e.push($UserValidationErrorsEnum.MISSING_PASSWORD);
        if(typeof email !== "string" || !regex().isPasswordValid(password)) e.push($UserValidationErrorsEnum.INVALID_PASSWORD);
        if(!email) e.push($UserValidationErrorsEnum.MISSING_EMAIL);
        if(typeof email !== "string" || !regex().isEmailValid(email)) e.push($UserValidationErrorsEnum.INVALID_EMAIL);
        if(!username) e.push($UserValidationErrorsEnum.MISSING_USERNAME);
        if(typeof username !== "string") e.push($UserValidationErrorsEnum.INVALID_USERNAME);
        if(!firstName) e.push($UserValidationErrorsEnum.MISSING_FIRSTNAME);
        if(typeof firstName !== "string") e.push($UserValidationErrorsEnum.INVALID_FIRSTNAME);
        if(!lastName) e.push($UserValidationErrorsEnum.MISSING_LASTNAME);
        if(typeof lastName !== "string") e.push($UserValidationErrorsEnum.INVALID_LASTNAME);
        /**
         * Return the validity response
         */
        if(!!e.length) return {valid:false, errors:e}
        return {valid:true, errors:e}
    }

    function loginUserByEmailForm(data:{email:string, password:string}):$ValidationResponse{
        const e:$UserValidationErrorsEnum[] = [];
        const {
            email,
            password
        }=data;
        /**
         * For each field check if it is valid or not.
         */
        if(!password) e.push($UserValidationErrorsEnum.MISSING_PASSWORD);
        if(!email) e.push($UserValidationErrorsEnum.MISSING_EMAIL);
        if(typeof email !== "string" || !regex().isEmailValid(email)) e.push($UserValidationErrorsEnum.INVALID_EMAIL);
        /** In this case password has not to match the regex, cause it could be a recovery pin */
        if(typeof password !== "string") e.push($UserValidationErrorsEnum.INVALID_PASSWORD);
        /**
         * Return the validity response
         */
        if(!!e.length) return {valid:false, errors:e}
        return {valid:true, errors:e}
    }

    function passwordChangeUserByEmailForm(data:{password:string}):$ValidationResponse{
        const e:$UserValidationErrorsEnum[] = [];
        const {
            password
        }=data;
        /**
         * Check if password is valid
         */
        if(!password) e.push($UserValidationErrorsEnum.MISSING_PASSWORD);
        if(typeof password !== "string" || !regex().isPasswordValid(password)) e.push($UserValidationErrorsEnum.INVALID_PASSWORD);
        /**
         * Return the validity response
         */
        if(!!e.length) return {valid:false, errors:e}
        return {valid:true, errors:e}
    }

    function passwordRecoveryUserByEmailForm(email:string):$ValidationResponse{
        const e:$UserValidationErrorsEnum[] = [];
        /**
         * Check if password is valid
         */
         if(!email) e.push($UserValidationErrorsEnum.MISSING_EMAIL);
         if(typeof email !== "string" || !regex().isEmailValid(email)) e.push($UserValidationErrorsEnum.INVALID_EMAIL);
         /**
          * Return the validity response
          */
         if(!!e.length) return {valid:false, errors:e}
         return {valid:true, errors:e}
    }
}