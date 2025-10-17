import { Router } from 'express'

import {
    createQuiz,
    getQuizById,
    updateQuiz
} from '../controllers/quiz.js'

import authenticateToken from '../middleware/authenticateToken.js'
import validateRequest from '../middleware/validateRequest.js'

import createQuizSchema from '../validations/quiz/createQuiz.js'
import updateQuizSchema from '../validations/quiz/updateQuiz.js'

const router = Router()

router.post(
    '/quizzes',
    authenticateToken,
    validateRequest(createQuizSchema),
    createQuiz
)

router.get(
    '/quizzes/:id',
    authenticateToken,
    getQuizById
)

router.patch(
    '/quizzes/:id',
    authenticateToken,
    validateRequest(updateQuizSchema),
    updateQuiz
)

export default router