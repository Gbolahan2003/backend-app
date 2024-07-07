import fs from 'fs' 
import http from 'http'
import express from 'express'
import BodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import db from 'mongoose'
import mongoose from 'mongoose'
import { error } from 'console'
import dotenv from 'dotenv'
import crypto from  'crypto'
import { RegisterRouter, createRouter, logInRouter, userRouter } from './router/authRouter'
import { isAuthenticated } from './middlewares'
import { getUserBySessionToken } from './db/users'


// const randomized = randomNumbers()
const userName = process.env.USER_NAME
const password = process.env.PASSWORD

// measureExcustionTime(randomNumbers)

 
const app = express()

const router = createRouter()
dotenv.config()


const CORS_Options ={
    origin:'https://to-do-jdxn.onrender.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}

app.use(cookieParser())
app.use(cors(CORS_Options))
app.use(compression())
app.use(BodyParser.json())
app.use(router)




const server = http.createServer(app)
const port = 8080





const mongo_URL = `mongodb+srv://${userName}:${password}@cluster0.muwjhfn.mongodb.net/`


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