import { Router } from "express"

import { createQuestion } from "../controllers/admin.js"

import authenticateToken from "../middleware/authenticateToken.js"

const router = Router()

router.post('/questions', authenticateToken, createQuestion)

export default router