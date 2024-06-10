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
import { RegisterRouter, logInRouter, post, post2 } from './router/authRouter'


 
const app = express()
dotenv.config()

app.use(cors({}))

const userName = process.env.USER_NAME
const password = process.env.PASSWORD

 
app.use(compression())
app.use(cookieParser())
app.use(BodyParser.json())


app.use('/auth', RegisterRouter)
app.use('/auth', logInRouter)
app.use('/test', post)
app.use('/test', post2)



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