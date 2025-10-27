import { Router } from "express"

import { 
    answerAttempt, 
    finishAttempt 
} from "../controllers/attempt.js"

import authenticateToken from "../middleware/authenticateToken.js"

const router = Router()

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