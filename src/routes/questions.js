import { Router } from 'express'

import {
    createQuestion,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} from '../controllers/question.js'

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

router.get(
    '/questions/:questionId',
    authenticateToken,
    getQuestionById
)

router.patch(
    '/questions/:questionId',
    authenticateToken,
    validateRequest(updateQuestionSchema),
    updateQuestion
)

router.delete(
    '/questions/:id',
    authenticateToken,
    deleteQuestion
)

export default router