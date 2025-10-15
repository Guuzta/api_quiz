import { Router } from 'express'

import {
    createQuestion
} from '../controllers/user.js'

import authenticateToken from '../middleware/authenticateToken.js'
import validateRequest from '../middleware/validateRequest.js'

import createQuestionSchema from '../validations/questions/createQuestion.js'
import updateQuestionSchema from '../validations/questions/updateQuestion.js'

const router = Router()

router.post(
    '/questions',
    authenticateToken,
    validateRequest(createQuestionSchema),
    createQuestion
)

export default router