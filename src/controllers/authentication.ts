import express from 'express';
import { createUser, getUsersByEmail } from '../db/users';
import { authentication, random } from '../helpers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';

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
            message: 'Registration is successful',
            user
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

        const user = await getUsersByEmail(email);
        if (!user) {
            return res.status(403).json({
                status: '403',
                error: 'Invalid email or password'
            });
        }

        const expectedHash = authentication(user?.authentication?.salt, password);
        if (user?.authentication?.password !== expectedHash) {
            return res.status(403).json({
                status: '403',
                error: 'Invalid email or password'
            });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '10h' });
        res.cookie('session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        return res.status(200).json({
            status: '200',
            message: 'Login successful'
        });
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
