import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const generateToken = (user) => {

    const payload = {
        sub: user._id,
        role: user.role
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
        issuer: 'quiz-api-auth'
    })

    return token
}

export default generateToken