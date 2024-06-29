import express,{Request} from 'express';
import { createUser, deleteUserById, getUserBySessionToken, getUsers, getUsersByEmail, getUsersById } from '../db/users';
// import { authentication, random } from '../helpers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserInfo } from 'os';
import { userData } from '../interface';
import { errorHandler } from '../helpers/errorHandler';

interface authRequest extends Request {
    payload?:any
}

export const getUsersController =async(req:express.Request, res:express.Response)=>{
    const users:any = await getUsers()
    try {
       const userDetails = users?.map((user:userData, index:number)=>({
        id:user._id,
        user_id:index,
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        refreshToken:user.refreshToken
        }))
        res.status(200).json({
            body:{
            numberOfUsers:users.length,
            users:userDetails
            }
        }
        )
        
    } catch (error:any) {
        console.error(error)
        if(error.message){
            return res.status(400).json({
                status:'400',
                error:error.message
            }) 
        }
            return res.status(400).json({
                status:'400',
                error:'there is an error'
            }) 
        

    }
}

export const deleteUserController = async(req:express.Request,res:express.Response)=>{
try {
    const {id} =req.params
    const deleteUser = await deleteUserById(id)
    return res.json({
        status:200,
        message:'user deleted sucessfully'
    })
} catch (error) {
    console.log(error);
res.status(400).json({
    status:400,
    error:'there is an error'
})
    
}
}

export const getUserById =async(req:authRequest, res:express.Response)=>{
    try {
        
        // const {id} = req.params
        const {id} = req.payload
  
        const user = await  getUsersById(id)
        
        if (!user) {
            return res.status(404).json({ status: '404', error: 'User not found' });
        }

        return res.status(200).json({
            status:200,
            body:{
                user
            }
        })
    } catch (error:any) {
        errorHandler(error, req, res)
        console.log(error);
        
        
    }
}