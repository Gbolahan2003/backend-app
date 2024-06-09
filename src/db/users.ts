 import mongoose from "mongoose";


 const userSchema = new mongoose.Schema({
    firstName:{type:String, required:true},
    LastName:{type:String, required:true},
    email:{type:String, required:true},
    authentication:{
        password:{type:String, required:true, select:false},
        salt:{type:String, select:false},
        sessionToken:{type:String, select:false}
    }
 })

 export const userModel = mongoose.model('User', userSchema)

 export const getUsers = ()=>userModel.find()
 export const getUsersByEmail =(email:string)=>userModel.findOne({email})
 export const getUserBySessionToken =(Sessiontoken:string)=>userModel.findOne({
    'authentication.sessiontoken':Sessiontoken,
 })

 export const getUsersById =(id:string)=>userModel.findById(id)
 export const createUser=(values:Record<string, any>)=>new userModel(values).save().then((user)=> user.toObject())
 export const deleteUserById= (id:string)=>userModel.findOneAndDelete({_id:id})
 export const updateUserById =(id:string, values:Record<string, any>)=> userModel.findByIdAndUpdate(id, values)