import User from "../models/users.js"
import { hashPassword } from "../utils/password.js"

const registerUser = async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body

    try {

        const userExists = await User.findOne({
            $or: [
                { name: name },
                { email: email }
            ]
        })

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Usuário já cadastrado!'
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
        console.log(error)

        res.status(500).json({
            sucess: false,
            message: 'Erro interno no servidor!'
        })
    }
}

export { registerUser }