import { Router } from "express"

import { createQuestion, getQuestionById, updateQuestion } from "../controllers/admin.js"

import authenticateToken from "../middleware/authenticateToken.js"
import requireAdmin from "../middleware/requiredAdmin.js"
import validateRequest from "../middleware/validateRequest.js"

import updateQuestionSchema from "../validations/questions/updateQuestion.js"

const router = Router()

router.post('/questions', authenticateToken, requireAdmin, createQuestion)

router.get('/questions/:id', authenticateToken, requireAdmin, getQuestionById)

router.patch('/questions/:id', authenticateToken, requireAdmin, validateRequest(updateQuestionSchema), updateQuestion)

export default router