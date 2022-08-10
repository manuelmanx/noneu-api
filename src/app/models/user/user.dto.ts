/**
 * Define the user Model interface.
 */
export interface $UserModelInterface{
    _id?:string,
    password:string,
    lastLogin:Date|null,
    isSuperUser:boolean,
    username:string,
    firstName:string,
    lastName:string,
    email:string,
    joinDate:Date,
    isActive:boolean,
    pwResetPin?:string,
    emailVerified:boolean,
}

/**
 * Export a partial User model type for registration.
 */
export type $UserModelCreateInterface = Omit<$UserModelInterface, 'lastLogin'|'isSuperUser'|'joinDate'|'isActive'|'emailVerified'>

export enum $UserValidationErrorsEnum{
    "SUCCESS"="SUCCESS",
    "MISSING_PASSWORD"="MISSING_PASSWORD",
    "INVALID_PASSWORD"="INVALID_PASSWORD",
    "MISSING_USERNAME"="MISSING_USERNAME",
    "MISSING_FIRSTNAME"="MISSING_FIRSTNAME",
    "MISSING_LASTNAME"="MISSING_LASTNAME",
    "MISSING_EMAIL"="MISSING_EMAIL",
    "INVALID_EMAIL"="INVALID_EMAIL",
    "USER_ALREADY_EXISTS"="USER_ALREADY_EXISTS",
    "USER_NOT_FOUND"="USER_NOT_FOUND",
    "PASSWORD_NOT_MATCHING"="PASSWORD_NOT_MATCHING",
    "INVALID_USERNAME"="INVALID_USERNAME",
    "INVALID_FIRSTNAME"="INVALID_FIRSTNAME",
    "INVALID_LASTNAME"="INVALID_LASTNAME",
    "PASSWORD_NOT_CHANGED"="PASSWORD_NOT_CHANGED",
    "EMAIL_NOT_VERIFIED"="EMAIL_NOT_VERIFIED"
}

