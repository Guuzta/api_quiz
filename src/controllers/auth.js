import User from "../models/users.js"
import { hashPassword } from "../utils/password.js"
import { registerUserSchema } from "../validations/register.js"

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

export { registerUser }