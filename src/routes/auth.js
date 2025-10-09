import { Router } from 'express'
import { registerUser, loginUser,  refreshUser } from '../controllers/auth.js'
import authenticateToken from '../middleware/authenticateToken.js'

const router = Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.post('/refresh', refreshUser)

router.get('/dashboard', authenticateToken, (req,res) => {

    const user = req.user

    res.json({
        message: 'Acesso autorizado na rota protegida!',
        user
    })
})

export default router