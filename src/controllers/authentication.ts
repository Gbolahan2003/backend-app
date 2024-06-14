import express from 'express';
import { createUser, getUsers, getUsersByEmail } from '../db/users';
import { authentication, random } from '../helpers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserInfo } from 'os';

dotenv.config();

export interface userData{
    firstName:string,
    lastName:string,
    email:string,
    accessToken:string
}
const JWT_SECRET = process.env.JWT_SECRET || '';
// const createdAt= Date.now()
export const registerController = async (req: express.Request, res: express.Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                status: '400',
                message: 'Incomplete credentials'
            });
        }

        const existingUser = await getUsersByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                status: '400',
                message: 'User with email already exists'
            });
        }

        const salt = random();
        const user = await createUser({
            firstName,
            lastName,
            email,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '10h' });
        res.cookie('session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

      
        return res.status(200).json({
            status: '200',
            message: 'Registration successful',
            user:{
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            accessToken:token,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt
            }
        }).end();
    } catch (error:any) {
        console.error(error);
        return res.status(400).json({
            status: '400',
            message: error.message || 'Error occurred'
        });
    }
};

export const logInController = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: '400',
                error: 'Missing email or password'
            });
        }

        const user = await getUsersByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.status(403).json({
                status: '403',
                error: 'Invalid email or password'
            });
        }

        const expectedHash = authentication(user.authentication?.salt, password);
        if (user.authentication?.password !== expectedHash) {
            return res.status(403).json({
                status: '403',
                error: 'Invalid email or password'
            });
        }
        const salt = random()
        user.authentication.sessionToken= authentication(salt, user._id.toString())
         await user.save()

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '10h' });
        res.cookie('session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' , domain:'localhost'});
    
         
        
        return res.status(200).json({
            status: '200',
            message: 'Login successful',
            user:{
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            accessToken:token,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt
            }
        }).end();
    } catch (error:any) {
        console.error(error);
        return res.status(400).json({
            status: '400',
            message: error.message || 'Error occurred'
        });
    }
};

export const testController = async (req: express.Request, res: express.Response) => {
    return res.status(201).json({
        message: 'Testing',
        body: {
            hi: 'hi'
        }
    });
};

export const testController2 = async (req: express.Request, res: express.Response) => {
    return res.status(201).json({
        message: 'Testing for the second time',
        body: {
            hi: 'hi'
        }
    });
};
2
export const getUsersController =async(req:express.Request, res:express.Response)=>{
    const users:any = await getUsers()
    try {
       const userDetails = users?.map((user:userData, index:number)=>({
        id:index,
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
