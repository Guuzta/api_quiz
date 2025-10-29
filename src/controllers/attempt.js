import mongoose from "mongoose"

import Attempt from "../models/Attempt.js"

const answerAttempt = async (req, res) => {
    const { attemptId } = req.params
    const userId = req.user.sub

    const { questionId, selectedIndex } = req.body

    try {
        const isValid = mongoose.Types.ObjectId.isValid(attemptId)

        if (!isValid) {
            console.log('Attempt ID inválido!')

            return res.status(400).json({
                success: false,
                message: 'Não foi possível acessar esse attempt!'
            })
        }

        const filters = { _id: attemptId, userId }

        const attempt = await Attempt.findOne(filters)

        if (!attempt) {
            console.log('Esse attempt não existe ou pertence a outro usuário!')

            return res.status(404).json({
                success: false,
                message: 'Não foi possível encontrar esse attempt!'
            })
        }

        const attemptInProgress = attempt.status === 'in_progress' ? true : false

        if (!attemptInProgress) {
            return res.status(403).json({
                success: false,
                message: 'Esse attempt não está mais disponível, o Quiz já foi finalizado!'
            })
        }

        const question = attempt.questions
        .find(question => question.questionId.toString() === questionId)

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Não foi possível encontrar essa questão!'
            })
        }

        const alreadyAnswered = attempt.answers
        .some(answer => answer.questionId.toString() === questionId)

        if (alreadyAnswered) {
            return res.status(403).json({
                success: false,
                message: 'Essa questão já foi respondida!'
            })
        }

        const correct = selectedIndex === question.correctAnswer
        const pointsAwarded = correct ? 10 : 0

        attempt.answers.push({
            questionId,
            selectedIndex,
            correct,
            pointsAwarded
        })

        attempt.score += pointsAwarded
        attempt.lastActivityAt = Date.now()

        await attempt.save()

        res.status(200).json({
            success: true,
            message: 'Resposta da questão salva com sucesso!',
            correct,
            correctIndex: question.correctAnswer,
            pointsAwarded

        })

    } catch (error) {
        console.log('Erro interno no servidor ao verificar resposta!', error)

        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao verificar resposta!'
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