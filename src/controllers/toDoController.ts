import { Request, Response } from "express";
import { UpdateTodoById, deleteTodoById, getTodo, toDoModel } from "../db/toDoList";
import { errorHandler } from "../helpers/errorHandler";
import { error } from "console";

export const createToDoController =async(req:Request, res:Response)=>{
    try {
        const {user_id,title, description, status, completedAt}= req.body

        const newToDo = new toDoModel({
            user_id,
            title,
            description,
            status:status|| 'Pending',
            completedAt:status==='Completed'?completedAt||Date.now():undefined
            
        })
        const saveToDo = await newToDo.save()
        res.status(200).json({
            status:200,
            message:'new task created sucessfully!',
            body:saveToDo
        })
    } catch (error) {
        errorHandler(error, req, res)
        console.log(error);
        
    }
}


export const getAllToDoController = async(req:Request, res:Response)=>{
    try {

        const toDoList = await toDoModel.find()
        return res.status(200).json({
            status:200,
            message:'Task list fetched sucessfully',
            body:toDoList
        })
        
        
    } catch (error) {
        errorHandler(error, req, res)
        console.log(error);
    }
}

export const getToDobyIdController = async(req:Request, res:Response)=>{
    try {
        const {id} = req.params
        const ToDo = getTodo(id)
        if(!ToDo){
            return res.status(400).json({
                status:400,
                error:'Task does not exist'
            })
        }
        return res.status(200).json({
            status:200,
            message:'Task found sucessfully',
            body:ToDo
        })
    } catch (error) {
        errorHandler(error, req, res)
        console.log(error);
    }
}
export const updateTaskController = async(req:Request, res:Response)=>{
    try {
        const {id} = req.params
        const {user_id,  title, description, status, completedAt, updatedAt}= req.body
        if(status==='Completed'){
            return res.status(200).json({
                status:200,
                message:'Task already completed'
            })

        }
    
    
        const updateTask = await toDoModel.findByIdAndUpdate({
            id, 
            title,
            description,
            status,
            completedAt,
            updatedAt:Date.now()
        },
        { new: true, runValidators: true }
    )
    return res.status(200).json({
        status:200,
        message:'Task updated sucessfully',
        body:updateTask
    })
    } catch (error) {
        errorHandler(error, req, res)
        console.log(error);
    }
}


export const updateTaskStatusController=async(req:Request, res:Response)=>{
    try {
        const {id} = req.params
        const {status}= req.body
        if(status === 'Completed'){
            return res.status(200).json({
                status:200,
                message:'Task already completed'
            })
        }
        
        const updatedTaskStatus = await toDoModel.findByIdAndUpdate({
            id,
            status
        })

        return res.status(200).json({
            status:200,
            message:'Task status updated sucessfully'
        ,
        body: updatedTaskStatus
        })
    } catch (error) {
        errorHandler(error, req, res)
        console.log(error);
    }
}

export const deleteToDoController = async(req:Request, res:Response)=>{
    try {
        const {id}= req.params

        const deleteTask =  deleteTodoById(id)
        if(!deleteTask){
            return res.status(400).json({
                status:400,
                error:'Task does not exist'
            })
        }

        return res.status(200).json({
            status:200,
            message:'Task deletd sucessfully',
            body:deleteTask
        })
    } catch (error) {
        
    }
}