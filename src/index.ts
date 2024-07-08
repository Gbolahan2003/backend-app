import fs from 'fs' 
import http from 'http'
import express from 'express'
import BodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import db, { Collection } from 'mongoose'
import mongoose from 'mongoose'
import { error } from 'console'
import dotenv from 'dotenv'
import crypto from  'crypto'
import { RegisterRouter, createRouter, logInRouter, userRouter } from './router/authRouter'
import { isAuthenticated } from './middlewares'
import { getUserBySessionToken } from './db/users'
import { CorsOptions } from 'cors'
import MongoStore from 'connect-mongo'
import session, { Cookie, Session } from 'express-session'
import { env } from 'process'


// const randomized = randomNumbers()
const {PASSWORD, USER_NAME, JWT_SECRET, REFRESH_TOKEN_SECRET, SESSION_NAME, SESSION_LIFETIME, NODE_ENV}  = process.env 
const mongo_URL = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.muwjhfn.mongodb.net/`

// measureExcustionTime(randomNumbers)

 
const app = express()


const router = createRouter()
dotenv.config()



const CORS_Options:CorsOptions ={
    origin:["http://localhost:3000"],
    credentials: true,
}






app.use(cookieParser())
app.use(cors(CORS_Options))
app.disable('x-powered-by')
app.use(express.urlencoded({ extended: true }));
app.use(compression())
app.use(BodyParser.json())
app.use(session({
    name:SESSION_NAME,
    saveUninitialized:false,
    resave:false,
    store: MongoStore.create({
        mongoUrl:mongo_URL,
        collectionName:'sessions',
        ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie:{
    sameSite:true,
    secure:NODE_ENV ==='production',
    maxAge:1000 * 60 * 60 * 24 * 14 
    }
} as Session |any)  )
app.use(router)





const server = http.createServer(app)
const port = 8080







mongoose.Promise = Promise

mongoose.connect(mongo_URL)

mongoose.connection.on('connected', ()=>{
    console.log('connected to database..');
})
mongoose.connection.on('disconnected', ()=>{
    console.log('disconnected from database..');
})
mongoose.connection.on('error', (error:Error)=>console.log(`error :${error}`))
if(mongoose.connection){
    console.log('conected to database..');
    
}



server.listen(port, ()=>{
    console.log(`server is running on ${port}`);
    
})