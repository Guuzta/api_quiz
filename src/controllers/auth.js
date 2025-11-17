import authService from '../services/authService.js'

const registerUser = async (req, res) => {
    try {
        await authService.registerUser(req.body)

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
        const { user, accessToken, refreshToken } = await authService.loginUser(req.body)

        return res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso!',
            accessToken,
            refreshToken,
            user: {
                userId: user._id,
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
        const { accessToken, newRefreshToken } = await authService.refreshUser(req.body)

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
    try {
        await authService.logoutUser(req.body)

        res.status(200).json({
            success: true,
            message: 'Logout realizado com sucesso!'
        })
    } catch (error) {
        console.log(error)

        const status = error.statusCode || 500
        const message = error.message

        res.status(status).json({
            success: false,
            message
        })
    }

}

export { registerUser, loginUser, refreshUser, logoutUser }