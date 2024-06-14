import express from 'express'
import { logInController, registerController, testController, testController2 } from '../controllers/authentication'
import { deleteUserController, getUsersController } from '../controllers/userController'
import { isAuthenticated, isOwner } from '../middlewares'
import { deleteUserById } from '../db/users'

const router = express.Router()

export const logInRouter = router.post('/login', logInController)

export const RegisterRouter = router.post('/sign-up', registerController)
export const userRouter = router.get('/users',  getUsersController)
export const post = router.get('/testing', testController)
export const post2 = router.get('/second', testController2)

export const createRouter=()=>{
//auth
router.post('/auth/login', logInController);
router.post('/auth/sign-up', registerController);

// Test Routes
router.get('/test/testing', testController);
router.get('/test/second', testController2);

// User Routes
router.get('/user/users', isAuthenticated, getUsersController);
router.delete('/user/:id' , isAuthenticated,isOwner, deleteUserController)

return router;
}