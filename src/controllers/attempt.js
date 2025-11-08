import attemptService from '../services/attemptService.js'

const startAttempt = async (req, res) => {
    const { quizId } = req.params
    const userId = req.user.sub

    try {
        const { 
            attemptId, 
            quizSnapshot, 
            questions 
        } = await attemptService.startAttempt({ quizId, userId })

        res.status(201).json({
            success: true,
            message: 'Nova tentativa criada com sucesso!',
            attemptId,
            quizSnapshot,
            questions
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

const answerAttempt = async (req, res) => {
    const { attemptId } = req.params
    const userId = req.user.sub

    const { questionId, selectedIndex } = req.body

    try {
        const { correct, correctIndex, pointsAwarded } = await attemptService.answerAttempt({ 
            attemptId,
            userId,
            questionId,
            selectedIndex
        })

        res.status(200).json({
            success: true,
            message: 'Resposta da questão salva com sucesso!',
            correct,
            correctIndex,
            pointsAwarded

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

const finishAttempt = async (req, res) => {
    const { attemptId } = req.params
    const userId = req.user.sub  

    try {
        const attemptInfo = await attemptService.finishAttempt({ attemptId, userId })

        res.status(200).json({
            success: true,
            message: 'Tentativa finalizada com sucesso!',
            attemptInfo
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
    startAttempt,
    answerAttempt,
    finishAttempt
}