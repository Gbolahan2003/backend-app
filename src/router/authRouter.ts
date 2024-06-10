import express from 'express'
import { logInController, registerController, testController, testController2 } from '../controllers/authentication'

const router = express.Router()

export const logInRouter = router.post('/login', logInController)

export const RegisterRouter = router.post('/sign-up', registerController)
export const post = router.get('/testing', testController)
export const post2 = router.get('/second', testController2)