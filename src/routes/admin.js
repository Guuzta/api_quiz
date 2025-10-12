import { Router } from "express"

import { createQuestion } from "../controllers/admin.js"

import authenticateToken from "../middleware/authenticateToken.js"
import requireAdmin from "../middleware/requiredAdmin.js"

const router = Router()

router.post('/questions', authenticateToken, requireAdmin, createQuestion)

export default router