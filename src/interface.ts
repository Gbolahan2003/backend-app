export interface userData{
    _id:string|number,
    firstName:string,
    lastName:string,
    email:string,
    accessToken:string,
    refreshToken:string
}


export interface user {
    user:userData
}

