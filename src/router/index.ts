import crypto from 'crypto'


const SECRET = 'Matthews_REST_API'
export const random = ()=> crypto.randomBytes(128).toString('base64')

export const authentication =(salt:string|null|undefined, password:string)=>{

    return crypto.createHmac('sha25', [salt,password].join('/')).update(SECRET).digest('hex')
}