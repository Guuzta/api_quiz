import jwt from 'jsonwebtoken'

import User from "../models/users.js"

import { hashPassword, comparePassword } from "../utils/password.js"

import { registerUserSchema } from "../validations/register.js"
import loginUserSchema from "../validations/login.js"

import generateAccessToken from "../utils/tokens/accessToken.js"
import generateRefreshToken from "../utils/tokens/refreshToken.js"

const registerUser = async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body

    try {
        await registerUserSchema.validate(req.body, { abortEarly: false })
    } catch (error) {
        const { errors } = error

        return res.status(400).json({
            success: false,
            errors
        })
    }

    try {

        const userExists = await User.findOne({
            $or: [
                { name: name },
                { email: email }
            ]
        })

        if (userExists) {
            console.log('Usuário já cadastrado!')

            return res.status(400).json({
                success: false,
                message: 'Não foi possível cadastrar o usuário!'
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = new User({
            name,
            email,
            password: hashedPassword
        })

        await user.save()

        res.status(200).json({
            success: true,
            message: 'Usuário cadastrado com sucesso!'
        })

    } catch (error) {
        console.log('Erro ao salvar no banco de dados!', error.errors)

        res.status(500).json({
            sucess: false,
            message: 'Erro interno no servidor!'
        })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        await loginUserSchema.validate(req.body, { abortEarly: false })
    } catch (error) {
        const { errors } = error

        return res.status(400).json({
            success: false,
            errors
        })
    }

    try {
        const user = await User.findOne({ email })

        if (!user) {
            console.log('Email não está cadastrado no banco de dados!')

            return res.status(400).json({
                success: false,
                message: 'Credenciais inválidas!'
            })
        }

        const userPassword = user.password

        const isPasswordValid = await comparePassword(password, userPassword)

        if (!isPasswordValid) {
            console.log('Senha incorreta!')

            return res.status(400).json({
                success: false,
                message: 'Credenciais inválidas!'
            })
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        user.refreshToken = refreshToken
        await user.save()

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
        console.log('Erro interno no servidor!', error)

        res.status(500).json({
            sucess: false,
            message: 'Erro interno no servidor!'
        })
    }
}

const refreshUser = async (req, res) => {

    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Token de atualização não fornecido!'
        })
    }

    const user = await User.findOne({ refreshToken })

    if (!user) {
        return res.status(403).json({
            success: false,
            message: 'Token de atualização inválido!'
        })
    }

    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        const accessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        user.refreshToken = newRefreshToken
        await user.save()

        return res.status(200).json({
            success: true,
            accessToken,
            refreshToken: newRefreshToken
        })
    } catch (error) {
        console.error(error)

        return res.status(403).json({
            success: false,
            message: 'Token de atualização inválido!'
        })
    }
}

export { registerUser, loginUser, refreshUser }