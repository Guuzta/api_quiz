import User from "../models/User.js"

import { hashPassword, comparePassword } from "../utils/password.js"

import jwt from 'jsonwebtoken'
import generateAccessToken from "../utils/tokens/accessToken.js"
import generateRefreshToken from "../utils/tokens/refreshToken.js"

import StatusError from "../utils/StatusError.js"

const registerUser = async (userData) => {
    const {
        name,
        email,
        password,
        role
    } = userData

    const userExists = await User.findOne({
        $or: [
            { name: name },
            { email: email }
        ]
    })

    if (userExists) {
        console.log('Usuário já cadastrado!')

        throw new StatusError('Não foi possível cadastrar o usuário!', 400)
    }

    const hashedPassword = await hashPassword(password)

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    })

    return user
}

const loginUser = async (userData) => {
    const { email, password } = userData

    const user = await User.findOne({ email })

    if (!user) {
        console.log('Email não está cadastrado no banco de dados!')

        throw new StatusError('Credenciais inválidas!', 400)
    }

    const isPasswordValid = await comparePassword(password, user.password)

    if(!isPasswordValid) {
        console.log('Senha incorreta!')

        throw new StatusError('Credenciais inválidas!', 400)
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    user.refreshToken = refreshToken
    await user.save()

    return {user, accessToken, refreshToken}
}

const refreshUser = async ({ refreshToken }) => {
    if(!refreshToken) {
        throw new StatusError('refreshToken não fornecido!', 401)
    }

    const user = await User.findOne({ refreshToken })

    if(!user) {
        throw new StatusError('refreshToken inválido!', 403)
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    const accessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)

    user.refreshToken = newRefreshToken
    await user.save()

    return {accessToken, newRefreshToken}
}

const logoutUser = async ({ refreshToken }) => {
    if(!refreshToken) {
        throw new StatusError('refreshToken não fornecido!', 401)
    }

    const user = await User.findOne({ refreshToken })

    if(!user) {
        throw new StatusError('refreshToken inválido!', 403)
    }

    user.refreshToken = null
    await user.save()
}

export default { registerUser, loginUser, refreshUser, logoutUser }