import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const generateAccessToken = (user) => {

    const payload = {
        sub: user._id,
        role: user.role
    }

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        issuer: 'quiz-api-auth'
    })

    return accessToken
}

export default generateAccessToken