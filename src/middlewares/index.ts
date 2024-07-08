import { get, merge } from "lodash";
import { getUserBySessionToken, getUsersById } from '../db/users';
import express, { Request, Response, NextFunction } from 'express';
import JWT from "jsonwebtoken";
import { errorHandler } from "../helpers/errorHandler";
import { userData } from "../interface";
import { extractUserDetailsFromToken } from "../helpers";
import { getUserById } from "../controllers/userController";
import { toDoModel } from "../db/toDoList";
import { error } from "console";

export interface AuthenticatedRequest extends Request {
    payload?: any;
    identity?: { _id: string };
    users?:any
  
}
const secretKey = process.env.JWT_SECRET || '';




export const isAuthenticated =async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    const session = req.cookies['session']

    try {
        if(!session){
            return res.status(403).json({
                status:403,
                error:'Invalid request: No token provided'
            })
        }
        const user = extractUserDetailsFromToken(session)

        if(!user){
            return res.status(400).json({
                status:400,
                error:'User does not exist '
            })
        }
        
        
        const existingUser =  await getUsersById(user.id)

        req.payload = existingUser

        merge(req, { identity: existingUser });
        next()
        
    } catch (error) {
        errorHandler(error, req, res)
    }
}

export const isOwner = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.payload;
        const currentUserId = get(req, 'identity._id');

        console.log('Payload ID:', id);
        console.log('Current User ID:', currentUserId);

        if (!currentUserId || currentUserId.toString() !== id.toString()) {
            return res.status(403).json({ status: 403, error: 'You are not authorized to perform this action' });
        }

        next();
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).json({ status: 500, error: 'An unexpected error occurred' });
    }
};


export const taskOwner = async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{

    const {id} = req.params
    const currentUserId = get(req, 'identity._id')
    try {
        if(!currentUserId){
            return res.status(403).json({ status: 403, error: 'You are not authorized to perform this action' });
        }
        const task = await toDoModel.findById(id)
        if (!task) {
            return res.status(404).json({ status: 404, error: 'Task not found' });
        }

        if(task.user_id.toString() !== currentUserId.toString()){
            return res.status(403).json({ status: 403, error: 'You are not authorized to perform this action' });

        }
        next()
        
    } catch (error) {
        errorHandler(error, req, res)
    }
}