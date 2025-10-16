import { Router } from 'express'

import {
    createQuiz,
    getQuizById
} from '../controllers/quiz.js'

import authenticateToken from '../middleware/authenticateToken.js'
import validateRequest from '../middleware/validateRequest.js'

import createQuizSchema from '../validations/quiz/createQuiz.js'

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

export default router