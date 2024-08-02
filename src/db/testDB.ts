import mongoose from "mongoose";
import {v4 as uuidv4} from 'uuid'

const testScehema =  new mongoose.Schema({
    id:{
        type:String,
        default:uuidv4,
        unique:true

    },
    message:String
})


export const  testModel = mongoose.model('Test', testScehema)