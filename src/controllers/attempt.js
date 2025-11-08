import mongoose from "mongoose"

import Attempt from "../models/Attempt.js"

import attemptService from '../services/attemptService.js'

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
        const isValid = mongoose.Types.ObjectId.isValid(attemptId)

        if(!isValid) {
            console.log('Attempt ID inválido!')

            return res.status(400).json({
                success: false,
                message: 'Não foi possível acessar esse attempt!'
            })
        }

        const filters = { _id: attemptId, userId }

        const attempt = await Attempt.findOne(filters)

        if(!attempt) {
            console.log('Esse attempt não existe ou pertence a outro usuário!')

            return res.status(404).json({
                success: false,
                message: 'Não foi possível encontrar esse attempt!'
            })
        }

        const attemptIsFinished = attempt.status === 'finished' || 'abandoned' ? true : false

        if(attemptIsFinished) {
            return res.status(403).json({
                success: false,
                message: 'Esse attempt não está mais disponível, o Quiz já foi finalizado!'
            })
        }

        attempt.status = 'finished'
        attempt.percentage = attempt.score / attempt.totalPossibleScore * 100
        attempt.finishedAt = Date.now()

        await attempt.save()

        const attemptInfo = {
            attemptId,
            score: attempt.score,
            totalPossibleScore: attempt.totalPossibleScore,
            percentage: attempt.percentage,
            answers: attempt.answers
        }

        res.status(200).json({
            success: true,
            message: 'Quiz finalizado com sucesso!',
            attemptInfo
        })

    } catch (error) {
        console.log('Erro interno no servidor ao finalizar attempt!', error)

        res.status(500).json({
            success: false,
            message:'Erro interno no servidor ao finalizar attempt!'
        })
    }
}

export {
    answerAttempt,
    finishAttempt
}