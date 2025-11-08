import mongoose from "mongoose"

import Attempt from '../models/Attempt.js'
import Quiz from "../models/Quiz.js"

import StatusError from "../utils/StatusError.js"

const startAttempt = async ({ quizId, userId }) => {
    await Attempt.updateMany(
        { userId, status: 'in_progress' },
        {
            $set: {
                status: 'abandoned',
                finishedAt: Date.now(),
                abandonedReason: 'new_start'
            }
        }
    )

    const isValid = mongoose.Types.ObjectId.isValid(quizId)

    if (!isValid) {
        throw new StatusError('ID do Quiz inválido!', 400)
    }

    const quiz = await Quiz.findById(quizId).populate('questions')

    if (!quiz) {
        throw new StatusError('Quiz não encontrado!', 404)
    }

    const questionSnapshots = quiz.questions.map(question => {
        const shuffledOrder = question.options
            .map((option, index) => ({ option, index }))
            .sort(() => Math.random() - 0.5)
            .map(object => object.index)

        return {
            questionId: question._id,
            text: question.text,
            options: question.options,
            correctAnswer: question.correctAnswer,
            shuffledOrder
        }
    })

    const attempt = await Attempt.create({
        userId,
        quizId,
        quizSnapshot: {
            title: quiz.title,
            questionCount: quiz.questions.length
        },
        questions: questionSnapshots,
        answers: [],
        score: 0,
        totalPossibleScore: quiz.questions.length * 10,
        percentage: 0,
        startedAt: new Date(),
        status: 'in_progress'
    })

    const safeQuestions = questionSnapshots.map(question => ({
        questionId: question.questionId,
        text: question.text,
        options: question.shuffledOrder.map(index => question.options[index])
    }))

    return { 
        attemptId: attempt.id, 
        quizSnapshot: attempt.quizSnapshot,
        questions: safeQuestions  
    }
}

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
    startAttempt,
    answerAttempt,
    finishAttempt
}