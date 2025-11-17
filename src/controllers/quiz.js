import quizService from '../services/quizService.js'

const createQuiz = async (req, res) => {
    try {
        const quiz = await quizService.createQuiz(req.body)

        res.status(201).json({
            success: true,
            message: 'Quiz criado com sucesso!',
            quiz
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

const getQuizById = async (req, res) => {
    try {
        const quiz = await quizService.getQuizById(req.params)

        res.status(200).json({
            success: true,
            message: 'Quiz encontrado com sucesso!',
            quiz
        })
    } catch (error) {
        console.log(error)

        const status = error.statusCode || 500
        const message = error.message

        res.status(status).json({
            success: false,
            message,
        })
    }
}

const getUserQuizzes = async (req, res) => {
    const { userId } = req.params
    const currentUser = req.user.sub
    const { category, difficulty } = req.query

    try {
        const quizzes = await quizService.getUserQuizzes({
            userId,
            currentUser,
            category,
            difficulty
        })

        res.status(200).json({
            success: true,
            quizzes
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

const getAllQuizzes = async (_, res) => {
    try {
        const quizzes = await quizService.getAllQuizzes()

        res.status(200).json({
            success: true,
            message: 'Quizzes encontrados com sucesso!',
            quizzes
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

const updateQuiz = async (req, res) => {
    const { quizId } = req.params
    const currentUser = req.user.sub
    const updates = req.updates

    try {
        const updatedQuiz = await quizService.updateQuiz({
            quizId,
            currentUser,
            updates
        })

        res.status(200).json({
            success: true,
            message: 'Quiz atualizado com sucesso!',
            updatedQuiz
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

const deleteQuiz = async (req, res) => {
    const { quizId } = req.params
    const currentUser = req.user.sub

    try {
        await quizService.deleteQuiz({ quizId, currentUser })

        res.status(200).json({
            success: true,
            message: 'Quiz deletado com sucesso!'
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

export {
    createQuiz,
    getQuizById,
    getUserQuizzes,
    getAllQuizzes,
    updateQuiz,
    deleteQuiz,
}