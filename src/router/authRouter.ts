import express from 'express'
import { logInController, logoutController, refreshTokenController, registerController } from '../controllers/authentication'
import { deleteUserController, getUserById, getUsersController, userController } from '../controllers/userController'
import { isAuthenticated, isOwner, taskOwner } from '../middlewares'
import { deleteUserById } from '../db/users'
import { createToDoController, deleteToDoController, getAllToDoController, getToDobyIdController, updateTaskController, updateTaskStatusController } from '../controllers/toDoController'
import { createTestController, getTestByIdController, getTestController, updateTestController } from '../controllers/testController'

const router = express.Router()

// export const logInRouter = router.post('/login', logInController)

// export const RegisterRouter = router.post('/sign-up', registerController)
// export const userRouter = router.get('/users',  getUsersController)

export const createRouter=()=>{
//auth
router.post('/auth/login', logInController);
router.post('/auth/sign-up', registerController);
router.delete('/auth/logout', isAuthenticated, isOwner, logoutController)
router.post('/refreshToken', isAuthenticated, refreshTokenController)

// Test Routes
router.get('/test', getTestController);
router.get('/test/:id', getTestByIdController)
router.post('/test', createTestController)
router.patch('/test/:id', updateTestController)
// router.get('/test/second', testController2);

// User Routes
router.get('/user/users',  isAuthenticated, getUsersController);
router.delete('/user/:id' , isAuthenticated , isOwner, deleteUserController)
router.get('/user', isAuthenticated, getUserById )
router.get('/user2', userController)


//toDo controller
router.get('/task/allTasks', isAuthenticated, getAllToDoController)
router.get('/task/:id', isAuthenticated, taskOwner,getToDobyIdController)
router.post('/task', isAuthenticated, createToDoController)
router.put('/task/:id', isAuthenticated,taskOwner, updateTaskController  )
router.patch('/task/status/:id', isAuthenticated,taskOwner, updateTaskStatusController)
router.delete('/task/:id',isAuthenticated, taskOwner, deleteToDoController)


return router;
}


