import { Router } from "express"

import { answerAttempt } from "../controllers/attempt.js"

import authenticateToken from "../middleware/authenticateToken.js"

const router = Router()

router.post(
    '/attempts/:attemptId/answer',
    authenticateToken,
    answerAttempt
)

export default router