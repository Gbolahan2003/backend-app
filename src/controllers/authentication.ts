import express, { Request, Response } from 'express';
import { createUser, getUsersByEmail, userModel } from '../db/users';
import { authentication, generateAccessToken, generaterefreshToken, random } from '../helpers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorHandler } from '../helpers/errorHandler';

dotenv.config();

const { PASSWORD, USER_NAME, JWT_SECRET, REFRESH_TOKEN_SECRET, SESSION_NAME, SESSION_LIFETIME, NODE_ENV, SESSION_SECRET } = process.env;


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
        const hashedPassword = authentication(salt, password);

        const user:any = await createUser({
            firstName,
            lastName,
            email,
            authentication: {
                salt,
                password: hashedPassword,
                sessionToken: '',
                refreshToken: ''
            }
        });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET||'', { expiresIn: '10h' });
        const refreshToken = generaterefreshToken({ id: user._id, email: user.email });
        user.authentication.sessionToken = token;
        user.authentication.refreshToken = refreshToken;
        await user.save();

        res.cookie('session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        return res.status(200).json({
            status: '200',
            message: 'Registration successful',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                sessionToken: token,
                refreshToken: refreshToken,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        }).end();
    } catch (error: any) {
   errorHandler(error, req, res)
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

        const salt = random();
        // const sessionToken = authentication(salt, user._id.toString());
        
        const refreshToken = generaterefreshToken({ id: user._id, email: user.email });
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET ||'', { expiresIn: '10h' });
        user.authentication.sessionToken = token;
        user.authentication.refreshToken = refreshToken;
        await user.save();

        res.cookie('session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', domain: 'localhost' });

        return res.status(200).json({
            status: '200',
            message: 'Login successful',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                sessionToken: token,
                refreshToken: refreshToken,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        }).end();
    } catch (error: any) {
     errorHandler(error, req,res)
    }
};

export const refreshTokenController = async (req: express.Request, res: express.Response) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET || '') as any;
        const user = await userModel.findById(payload.id);
        if (!user || user.authentication?.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken({ id: user._id, email: user.email });
        const newRefreshToken = generaterefreshToken({ id: user._id, email: user.email });

        if (user.authentication) {
            user.authentication.refreshToken = newRefreshToken;
        }
        await user.save();

        res.cookie('session', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        errorHandler(error, req, res);
        console.log(error);
    }
};



export const testController =async(req:express.Request, res:express.Response)=>{
     try {
        return res.status(200).json({
            status:200,
            message:'this is for testing'
        })
     } catch (error) {
        
     }

}

export const logoutController = async (req: Request, res: Response) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return errorHandler(err, req, res);
            }
            
            if(SESSION_NAME){
                res.clearCookie(SESSION_NAME);
            } 
            res.status(200).json({
                status: 200,
                message: 'Logout successful'
            });
        });
    } catch (error) {
        errorHandler(error, req, res);
        console.log(error);
    }
};