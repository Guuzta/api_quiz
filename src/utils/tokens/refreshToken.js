import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const generateRefreshToken = (user) => {

    const payload = { sub: user._id }

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        issuer: 'quiz-api-auth'
    })

    return refreshToken
}

export default generateRefreshToken