import User from "../models/User.js"

import { hashPassword } from "../utils/password.js"

import registerUserSchema from "../validations/register.js"

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
            {name: name},
            {email: email}
        ]
    })

    if(userExists) {
        console.log('Usuário já cadastrado!')

        throw new StatusError('Não foi possível cadastrar o usuário!', 400)
    }

    const hashedPassword = await hashPassword(password)

    const user  = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    })

    return user
}

export default { registerUser }