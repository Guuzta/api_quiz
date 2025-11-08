import mongoose from "mongoose"

import Attempt from '../models/Attempt.js'

import StatusError from "../utils/StatusError.js"

const answerAttempt = async ({ attemptId, userId, questionId, selectedIndex }) => {
    let isValid = mongoose.Types.ObjectId.isValid(attemptId)

    if (!isValid) {
        throw new StatusError('Attempt ID inválido!', 400)
    }

    const attempt = await Attempt.findById(attemptId)

    if (!attempt) {
        throw new StatusError('Attempt não encontrado!', 404)
    }

    const isOwner = attempt.userId.toString() === userId

    if (!isOwner) {
        throw new StatusError('Você não tem permissão para acessar esse Attempt!', 403)
    }

    const attemptInProgress = attempt.status === 'in_progress'

    if (!attemptInProgress) {
        throw new StatusError('Esse Attempt não está mais disponível! A tentativa já foi finalizada!', 403)
    }

    isValid = mongoose.Types.ObjectId.isValid(questionId)

    if (!isValid) {
        throw new StatusError('ID da Questão inválido!', 400)
    }

    const question = attempt.questions
        .find(question => question.questionId.toString() === questionId)

    if (!question) {
        throw new StatusError('Questão não encontrada!', 404)
    }

    const alreadyAnswered = attempt.answers
        .some(answer => answer.questionId.toString() === questionId)

    if (alreadyAnswered) {
        throw new StatusError('Essa questão já foi respondida!', 403)
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

    return {
        correct,
        correctIndex: question.correctAnswer,
        pointsAwarded
    }
}

const finishAttempt = async ({ attemptId, userId }) => {
    const isValid = mongoose.Types.ObjectId.isValid(attemptId)

    if (!isValid) {
        throw new StatusError('Attempt ID inválido!', 400)
    }

    const attempt = await Attempt.findById(attemptId)

    if (!attempt) {
        throw new StatusError('Attempt não encontrado!', 404)
    }

    const isOwner = attempt.userId.toString() === userId

    if (!isOwner) {
        throw new StatusError('Você não tem permissão para acessar Attempt!', 403)
    }

    const attemptIsFinished = attempt.status !== 'in_progress' 

    if (attemptIsFinished) {
        throw new StatusError('Esse Attempt não está mais disponível! A tentativa já foi finalizada!', 403)
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

    return attemptInfo
}

export default {
    answerAttempt,
    finishAttempt
}