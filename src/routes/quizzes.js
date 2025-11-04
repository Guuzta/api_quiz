import { Router } from 'express'

import {
    createQuiz,
    getQuizById,
    getUserQuizzes,
    getAllQuizzes,
    updateQuiz,
    deleteQuiz,
    startQuiz
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
    '/quizzes/:quizId',
    authenticateToken,
    getQuizById
)

router.get(
    '/users/:userId/quizzes',
    authenticateToken,
    getUserQuizzes
)

router.get(
    '/quizzes',
    authenticateToken,
    getAllQuizzes
)

router.patch(
    '/quizzes/:quizId',
    authenticateToken,
    validateRequest(updateQuizSchema),
    updateQuiz
)

router.delete(
    '/quizzes/:quizId',
    authenticateToken,
    deleteQuiz
)

router.post(
    '/quizzes/:quizId/start',
    authenticateToken,
    startQuiz
)

export default router