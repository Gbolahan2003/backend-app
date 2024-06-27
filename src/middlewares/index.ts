import { get, identity, merge } from "lodash";
 import {getUserBySessionToken} from '../db/users'
 import express,{Request, Response,NextFunction} from 'express'
 import jwt from "jsonwebtoken";
import { error } from "console";
import { userData } from "../interface";



const secretKey = process.env.JWT_SECRET||''
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
 export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401); // No token, unauthorized
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Invalid token, forbidden
      }
    //   req.user = decoded as userData// Assign decoded payload to req.user
      next(); // Proceed to the next middleware or route handler
    });
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
    return res.status(500).json({
        status:'500',
        message:'there is an error'
    })
        
    }
 }