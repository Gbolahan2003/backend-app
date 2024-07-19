import mongoose, { Schema } from "mongoose";
import { todo } from "node:test";

  const toDoScehma = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
         required:true},
    description:{
        type:String, 
        required:true},
    status:{
        type:String,
        default:'Pending'
    },
    date:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    start:{
        type:String,
        required:true
    },
    end:{
        type:String,
        required:true
    },
    completedAt:{
        type:Date
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
})

export const toDoModel = mongoose.model('Todo', toDoScehma)

export const getTodo =(id:string)=> toDoModel.findById(id)
export const UpdateTodoById =(id:string|number)=> toDoModel.findByIdAndUpdate({_id:id})
export const deleteTodoById =(id:string|number)=>toDoModel.findByIdAndDelete({_id: id})


