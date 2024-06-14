import express from 'express';
import { createUser, deleteUserById, getUsers, getUsersByEmail } from '../db/users';
import { authentication, random } from '../helpers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserInfo } from 'os';
import { userData } from '../interface';

export const getUsersController =async(req:express.Request, res:express.Response)=>{
    const users:any = await getUsers()
    try {
       const userDetails = users?.map((user:userData, index:number)=>({
        id:user._id,
        user_id:index,
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email
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