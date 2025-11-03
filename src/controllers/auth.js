import jwt from 'jsonwebtoken'

import User from "../models/User.js"

import generateAccessToken from "../utils/tokens/accessToken.js"
import generateRefreshToken from "../utils/tokens/refreshToken.js"

import auth from '../services/auth.js'

const registerUser = async (req, res) => {
    try {
        await auth.registerUser(req.body)

        res.status(201).json({
            success: true,
            message: 'Usuário cadastrado com sucesso!'
        })
    } catch (error) {
        console.log(error)

        const status = error.statusCode || 500

        const message = error.name === 'ValidationError' 
        ? 'Erro interno no servidor ao cadastrar usuário!' 
        : error.message

        res.status(status).json({
            success: false,
            message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await auth.loginUser(req.body)

        return res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso!',
            accessToken,
            refreshToken,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error)

        const status = error.statusCode || 500
        const message = error.name === 'ValidationError' 
        ? 'Erro interno no servidor ao logar usuário!'
        : error.message

        res.status(status).json({
            success: false,
            message
        })
    }
}

const refreshUser = async (req, res) => {
    try {
        const { accessToken, newRefreshToken } = await auth.refreshUser(req.body)

        return res.status(200).json({
            success: true,
            accessToken,
            newRefreshToken
        })
    } catch (error) {
        console.log(error)

        const status = error.statusCode || 500
        const message = error.message 

        return res.status(status).json({
            success: false,
            message
        })
    }
}

const logoutUser = async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Token de atualização não fornecido!'
        })
    }

    try {
        const user = await User.findOne({ refreshToken })

        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'Token de atualização inválido!'
            })
        }

        user.refreshToken = null
        await user.save()

        res.status(201).json({
            success: true,
            message: 'Logout realizado com sucesso!'
        })
    } catch (error) {
        console.log('Erro interno no servidor ao tentar logout!', error)

        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao tentar logout!'
        })
    }

}

export { registerUser, loginUser, refreshUser, logoutUser }