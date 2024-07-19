import fs from 'fs';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { RegisterRouter, createRouter, logInRouter, userRouter } from './router/authRouter';
import { isAuthenticated } from './middlewares';
import { getUserBySessionToken } from './db/users';
import { random, randomNumbers } from './helpers';

// Load environment variables
dotenv.config();

const { PASSWORD, USER_NAME, JWT_SECRET, REFRESH_TOKEN_SECRET, SESSION_NAME, SESSION_LIFETIME, NODE_ENV, SESSION_SECRET } = process.env;
const mongo_URL = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.muwjhfn.mongodb.net/`;

const app = express();
const router = createRouter();

const CORS_Options: CorsOptions = {
    origin: ["https://task-app-wheat-five.vercel.app"],
    credentials: true,
};

app.use(cookieParser());
app.use(cors(CORS_Options));
app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(bodyParser.json());
app.use(session({
    name: SESSION_NAME,
    secret: SESSION_SECRET || 'defaultSecret', // Provide a default secret if SESSION_SECRET is not set
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: mongo_URL,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
        sameSite: true,
        secure: NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 14 // 14 days
    }
}));

app.use(router);

const server = http.createServer(app);
const port = 8080;

mongoose.Promise = Promise;

mongoose.connect(mongo_URL);

mongoose.connection.on('connected', () => {
    console.log('Connected to database.');
});
mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from database.');
});
mongoose.connection.on('error', (error: Error) => console.log(`Error: ${error}`));


// console.log(random());

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
