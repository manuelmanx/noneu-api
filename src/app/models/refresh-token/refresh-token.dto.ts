
export enum $AuthErrorEnum{
    "UNAUTHORIZED"="UNAUTHORIZED",
    "INVALID_AUTH_TOKEN"="INVALID_AUTH_TOKEN",
    "INVALID_REFRESH_TOKEN"="INVALID_REFRESH_TOKEN"
}
export interface $JwtUserInterface{
    _id:string,
    email:string,
}

export interface $RefreshTokenModelInterface{
    _id?:string,
    refreshToken:string,
    uid:string,
}