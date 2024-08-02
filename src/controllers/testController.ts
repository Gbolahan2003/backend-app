import express, { Request } from 'express'
import { errorHandler } from '../helpers/errorHandler'
import { testModel } from '../db/testDB'

interface TestRequest extends Request {
    id:string
}
export const getTestController =async(req:express.Request, res:express.Response)=>{
    try {
       const test = await testModel.find()
       return res.status(200).json({
        body:test
       })
    } catch (error) {
       errorHandler(error, req, res)
    }

}

export const createTestController = async(req:express.Request, res:express.Response)=>{
    try {
        const {message}= req.body
        const newTest = new testModel({
            message:message
        })
        const saveTest = await newTest.save()
        console.log(saveTest);
        
        return res.status(200).json({
        
            status:'200',
            body:saveTest
        })
    } catch (error) {
        errorHandler(error, req, res)
        console.log(error);
        
    }
}

export const updateTestController = async (req: express.Request, res: express.Response) => {
    try {
        const { message } = req.body;
        const { id } = req.params;

        // Find the document by ID and update the message field
        const updateTest = await testModel.findByIdAndUpdate(
            id,
            { message },
            { new: true }  // Return the updated document
        );

        if (!updateTest) {
            return res.status(404).json({
                status: 404,
                message: 'Document not found',
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Document updated successfully',
            data: updateTest,
        });

    } catch (error) {
        errorHandler(error, req, res);
        console.log(error);
    }
}


export const getTestByIdController = async(req:express.Request, res:express.Response)=>{
    try {
        const {id} = req.params
        const test = await testModel.findById(id)
        if(!test){
            return res.status(400).json({
                status:400,
                body:'sorry test does not exist'
            })
        }

        return res.status(200).json({
            status:200,
            body:test
        })
        
    } catch (error) {
        errorHandler(error, req, res)
        console.log(error);
        
    }
}