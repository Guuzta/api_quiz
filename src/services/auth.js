import User from "../models/User.js"

import { hashPassword, comparePassword } from "../utils/password.js"

import registerUserSchema from "../validations/register.js"
import loginUserSchema from "../validations/login.js"

import generateAccessToken from "../utils/tokens/accessToken.js"
import generateRefreshToken from "../utils/tokens/refreshToken.js"

import StatusError from "../utils/StatusError.js"

const registerUser = async (userData) => {
    try {
        await registerUserSchema.validate(userData, { abortEarly: false })
    } catch (error) {
        const { errors } = error

        throw new StatusError(errors.join(', '), 400)
    }

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
    try {
        await loginUserSchema.validate(userData, { abortEarly: false })
    } catch (error) {
        const { errors } = error

        throw new StatusError(errors.join(', '), 400)
    }

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

export default { registerUser, loginUser }