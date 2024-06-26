import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Consider adding unique constraint
    authentication: {
        password: { type: String, required: true },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: true },
        refreshToken:{type:String, select:true}
    },
}, {
    timestamps:true
});

export const userModel = mongoose.model('User', userSchema);

export const getUsers = () => userModel.find();
export const getUsersByEmail = (email: string) => userModel.findOne({ email });
export const getUserBySessionToken = async (sessionToken: string) => {
    const user = await userModel.findOne({ 'authentication.sessionToken': sessionToken }).exec();
    console.log('getUserBySessionToken:', user); // Debug log
    return user;
};
export const getUsersById = (id: string) => userModel.findById(id);
export const createUser = (values: Record<string, any>) => new userModel(values);
export const deleteUserById = (id: string) => userModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => userModel.findByIdAndUpdate(id, values);
