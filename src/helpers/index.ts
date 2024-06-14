import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const SECRET = process.env.JWT_SECRET ||''

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