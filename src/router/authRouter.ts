import express from 'express'
import { logInController, registerController } from '../controllers/authentication'

const router = express.Router()

export const logInRouter = router.post('/login', logInController)

export const RegisterRouter = router.post('/register', registerController)