import { Request, Response } from "express";
import { UpdateTodoById, deleteTodoById, getTodo, toDoModel } from "../db/toDoList";
import { errorHandler } from "../helpers/errorHandler";
import { error } from "console";
interface AuthenticatedRequest extends Request {
    payload?: any;
  }

export const createToDoController =async(req:AuthenticatedRequest, res:Response)=>{
    try {
        const {title, description, status, end, start, completedAt, date}= req.body
        const {id} = req.payload
        const newToDo = new toDoModel({
            user_id:id,
            title,
            description,
            start,
            end,
            date,
            status,
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


export const getAllToDoController = async(req:AuthenticatedRequest, res:Response)=>{
    try {
        const {id} = req.payload
        const toDoList = await toDoModel.find({user_id:id})

    
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

export const getToDobyIdController = async(req:AuthenticatedRequest, res:Response)=>{
    try {
        const {id} = req.params
        const ToDo = await getTodo(id)
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




export const updateTaskController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { user_id, title, description, status, completedAt, date,start, end } = req.body;

        const existingTask = await toDoModel.findById(id);
        if (!existingTask) {
            return res.status(404).json({
                status: 404,
                message: 'Task not found'
            });
        }

        if (existingTask.status === 'Completed') {
            return res.status(200).json({
                status: 200,
                message: 'Task already completed'
            });
        }

        // Update the task details
        const updatedTask = await toDoModel.findByIdAndUpdate(
            id,
            {
                title,
                description,
                status,
                start,
                date,
                end: status === 'Completed' ? Date.now() : end,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            status: 200,
            message: 'Task updated successfully',
            body: updatedTask
        });
    } catch (error) {
        errorHandler(error, req, res);
        console.log(error);
    }
};


export const updateTaskStatusController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await toDoModel.findById(id);
        if (!task) {
            return res.status(404).json({ status: 404, message: 'Task not found' });
        }

        if (task.status === 'Completed') {
            return res.status(200).json({
                status: 200,
                message: 'Task already completed'
            });
        }

        const updateFields: { status: string; completedAt?: Date } = { status };

        if (status === 'Completed') {
            updateFields.completedAt = new Date();
        }

        const updatedTaskStatus = await toDoModel.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedTaskStatus) {
            return res.status(500).json({ status: 500, message: 'Failed to update task status' });
        }

        return res.status(200).json({
            status: 200,
            message: 'Task status updated successfully',
            body: updatedTaskStatus
        });
    } catch (error) {
        errorHandler(error, req, res);
        console.log(error);
    }
};


export const deleteToDoController = async(req:Request, res:Response)=>{
    try {
        const {id}= req.params

        const deleteTask =   await deleteTodoById(id)
        if(!deleteTask){
            return res.status(400).json({
                status:400,
                error:'Task does not exist'
            })
        }

        return res.status(200).json({
            status:200,
            message:'Task deleted sucessfully',
            body:deleteTask
        })
    } catch (error) {
        errorHandler(error, req, res)
        console.log(error);
        
    }
}