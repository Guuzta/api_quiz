import mongoose from 'mongoose'

import User from '../models/User.js'
import Quiz from '../models/Quiz.js'
import Question from '../models/Question.js'

import StatusError from '../utils/StatusError.js'

const createQuestion = async (questionData) => {
    const {
        quizId,
        text,
        category,
        difficulty,
        options,
        correctAnswer,
        source,
        createdBy
    } = questionData

    let isValid = mongoose.Types.ObjectId.isValid(createdBy)

    if(!isValid) {
        throw new StatusError('ID do Usuário inválido!', 400)
    }

    const user = await User.findById(createdBy)

    if(!user) {
        throw new StatusError('Usuário não encontrado!', 404)
    }

    isValid = mongoose.Types.ObjectId.isValid(quizId)

    if(!isValid) {
        throw new StatusError('ID do Quiz inválido!', 400)
    }

    const quiz = await Quiz.findById(quizId)

    if(!quiz) {
        throw new StatusError('Quiz não encontrado!', 404)
    }

    const question = await Question.create({
        quizId,
        text,
        category,
        difficulty,
        options,
        correctAnswer,
        source,
        createdBy
    })

    await Quiz.findByIdAndUpdate(
        quizId,
        { $push: { questions: question._id } }
    )

    return question
}

const getQuestionById = async ({ questionId }, userId) => {
    const isValid = mongoose.Types.ObjectId.isValid(questionId)

    if(!isValid) {
        throw new StatusError('ID da Questão inválida!', 400)
    }

    const question = await Question.findById(questionId)

    if(!question) {
        throw new StatusError('Questão não encontrada!', 404)
    }

    const isOwner = question.createdBy.toString() === userId

    if(!isOwner) {
        throw new StatusError('Você não tem permissão para acessar essa questão!', 403)
    }

    return question
}

const updateQuestion = async ({ questionId }, userId, updates) => {
    const isValid = mongoose.Types.ObjectId.isValid(questionId)

    if(!isValid) {
        throw new StatusError('ID da Questão inválida!', 400)
    }

    const question = await Question.findById(questionId)

    if(!question) {
        throw new StatusError('Questão não encontrada!', 404)
    }

    const isOwner = question.createdBy.toString() === userId

    if(!isOwner) {
        throw new StatusError('Você não tem permissão para atualizar essa questão!', 403)
    }

    Object.assign(question, updates)
    const updatedQuestion = await question.save()

    return updatedQuestion
}

export default {
    createQuestion,
    getQuestionById,
    updateQuestion
}