import { get, identity, merge } from "lodash";
 import {getUserBySessionToken} from '../db/users'
 import express from 'express'
import { error } from "console";



export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id')

        if (typeof currentUserId !== 'string'|| currentUserId !== id) {
            return res.status(403).json({
                status: 403,
                error: 'You are not authorized to perform this action'
            });
        }
        next();
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).json({
            status: 500,
            error: 'An unexpected error occurred'
        });
    }
};

 export const isAuthenticated =async(req:express.Request, res:express.Response, next:express.NextFunction)=>{
    try {
      const sessionToken = req.cookies['session']
      const existingUser = getUserBySessionToken(sessionToken)

      if(!sessionToken || !existingUser){
        return res.status(403).json({
            status:'403',
            error:'Unauthorized request'
        })
      }
      merge(req, {identity:existingUser})
        return next()
    } catch (error) {
        console.log(error);
    return res.status(400).json({
        status:'400',
        message:'there is an error'
    })
        
    }
 }