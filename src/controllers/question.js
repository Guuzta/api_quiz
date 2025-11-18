import questionService from '../services/questionService.js'

const createQuestion = async (req, res) => {
    const currentUser = req.user.sub

    const {
        quizId,
        text,
        category,
        difficulty,
        options,
        correctAnswer,
        source,
        createdBy
    } = req.body

    try {
        const question = await questionService.createQuestion({
            currentUser,
            quizId,
            text,
            category,
            difficulty,
            options,
            correctAnswer,
            source,
            createdBy
        })

        res.status(201).json({
            success: true,
            message: 'Questão criada com sucesso!',
            question
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

const getQuestionById = async (req, res) => {
    try {
        const question = await questionService.getQuestionById(req.params, req.user.sub)

        res.status(200).json({
            success: true,
            message: 'Questão encontrada com sucesso!',
            question
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

const updateQuestion = async (req, res) => {
    try {
        const updatedQuestion = await questionService.updateQuestion(req.params, req.user.sub, req.updates)

        res.status(200).json({
            success: true,
            message: 'Questão atualizada com sucesso!',
            updatedQuestion
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

const deleteQuestion = async (req, res) => {
    try {
        await questionService.deleteQuestion(req.params, req.user.sub)

        res.status(200).json({
            success: true,
            message: 'Questão deletada com sucesso!'
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
    createQuestion,
    getQuestionById,
    updateQuestion,
    deleteQuestion
}