import { Router } from "express"

import { listRanking } from "../controllers/ranking.js"

import authenticateToken from "../middleware/authenticateToken.js"

const router = Router()

router.get(
    '/ranking',
    listRanking
)

export default router