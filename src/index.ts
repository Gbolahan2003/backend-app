import fs from 'fs' 
import http from 'http'
import express from 'express'
import BodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose from 'mongoose'
import { error } from 'console'
import dotenv from 'dotenv'
import crypto from  'crypto'
import { RegisterRouter, createRouter, logInRouter, post, post2, userRouter } from './router/authRouter'
import { measureExcustionTime, randomNumbers } from './helpers'
import { isAuthenticated } from './middlewares'


const randomized = randomNumbers()
const userName = process.env.USER_NAME
const password = process.env.PASSWORD

// measureExcustionTime(randomNumbers)

 
const app = express()

const router = createRouter()
dotenv.config()



app.use(cookieParser())
app.use(cors({}))
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