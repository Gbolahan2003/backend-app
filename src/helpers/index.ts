import crypto from 'crypto'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const SECRET = process.env.JWT_SECRET ||''
const REFRESH_TOKEN_SECRET = process.env.JWT_SECRET ||''

export const random = ()=> crypto.randomBytes(128).toString('base64')

export const authentication =(salt:string|null|undefined, password:string)=>{

    return crypto.createHmac('sha256', [salt,password].join('/')).update(SECRET).digest('hex')
}

export const randomNumbers = async()=>{
    let numArr:number[] =[]
    while (numArr.length<100) {
        const randomNums = Math.random()*10
     numArr.push(randomNums)
    }   
   return numArr

    
}

export const measureExcustionTime=async(callback:()=>void)=>{
    const start = performance.now()
   await callback()
    const end = performance.now()
    const duration = end-start

    console.log(callback(), `duration:${duration}`);
    

}

export const generateAccessToken =(payload:any)=>{
return jwt.sign(payload, REFRESH_TOKEN_SECRET,{expiresIn:'1m'})
}

export const generaterefreshToken =(payload:any)=>{
return jwt.sign(payload, REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
}

export const extractUserDetailsFromToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, SECRET) as any;
        return {
            id: decoded.id,
            email: decoded.email,
        };
    } catch (err) {
        console.error('Token verification error:', err);
        throw new Error('Invalid token');
    }
};
