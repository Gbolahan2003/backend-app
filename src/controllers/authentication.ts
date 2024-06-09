import express from 'express'
import { createUser, getUsersByEmail } from '../db/users'
import { authentication, random } from '../router'
import jwt from 'jsonwebtoken'
import { error } from 'console'


const JWT_SECRET = process.env.JWT_SECRET ||''
console.log(JWT_SECRET);



export const registerController = async(req:express.Request, res:express.Response)=>{
try {
    const {firstName, LastName, email, password} = req.body
    if(!firstName||!LastName! ||!email || password){
        return res.sendStatus(400)
    }
     const existingUser = getUsersByEmail(email)
     const salt = random()
     const user = await createUser({
    firstName, LastName, email,
    authentication:{
        salt,
        password:(authentication(salt, password))
    }
     })
     const token = jwt.sign({id:user._id, email:user.email},JWT_SECRET, {expiresIn:'10h'})
     res.cookie('session', token, {httpOnly:true, secure:true})
     return res.status(200).json({
        status:'200',
        message:'registration is sucessfull',
        user
     }
     ).end()
    
} catch (error) {
    console.log(error);
    return res.sendStatus(400)
    
}
}

export const logInController = async(req:express.Request, res:express.Response)=>{
    try {
        const {email, password}= req.body
        if(!email || !password){
            res.sendStatus(400).json({
                status:400,
                error:'Missing email or password'
            })
        }
        const user = await getUsersByEmail(email)
        if(!user){
            res.status(403).json({
                status:403,
                error:'Invalid email or password'
            })
        }

        const expectedHash = authentication(user?.authentication?.salt, password)
        if(user?.authentication?.password !== expectedHash){
            return res.status(403).json({
                status:403,
                error:'invalid Emai or password'
            })
        }
        const token = jwt.sign({id:user._id, email:user.email}, JWT_SECRET, {expiresIn:'10h'})
        res.cookie('session', token,{httpOnly:true, secure:true})
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
        
    }
}
