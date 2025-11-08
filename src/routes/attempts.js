import { Router } from "express"

import {
    startAttempt, 
    answerAttempt, 
    finishAttempt 
} from "../controllers/attempt.js"

import authenticateToken from "../middleware/authenticateToken.js"

const router = Router()

router.post(
    '/attempts/:quizId/start',
    authenticateToken,
    startAttempt
)

router.post(
    '/attempts/:attemptId/answer',
    authenticateToken,
    answerAttempt
)

router.post(
    '/attempts/:attemptId/finish',
    authenticateToken,
    finishAttempt
)

export default router