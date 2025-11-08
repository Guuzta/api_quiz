import { Router } from 'express'

import {
    registerUser,
    loginUser,
    refreshUser,
    logoutUser
} from '../controllers/auth.js'

import validateRequest from '../middleware/validateRequest.js'

import registerUserSchema from '../validations/register.js'
import loginUserSchema from '../validations/login.js'

const router = Router()

router.post(
    '/register',
    validateRequest(registerUserSchema), 
    registerUser
)

router.post(
    '/login', 
    validateRequest(loginUserSchema),
    loginUser
)

router.post(
    '/refresh', 
    refreshUser
)

router.post(
    '/logout', 
    logoutUser
)

export default router