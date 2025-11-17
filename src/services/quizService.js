import mongoose from "mongoose"

import User from "../models/User.js"
import Quiz from "../models/Quiz.js"

import StatusError from '../utils/StatusError.js'

const createQuiz = async (userData) => {
    const {
        title,
        description,
        category,
        difficulty,
        questions,
        createdBy
    } = userData

    const isValid = mongoose.Types.ObjectId.isValid(createdBy)

    if (!isValid) {
        throw new StatusError('ID do Usuário inválido!', 401)
    }

    const user = await User.findById(createdBy)

    if (!user) {
        throw new StatusError('Usuário não encontrado!', 404)
    }

    const quiz = Quiz.create({
        title,
        description,
        category,
        difficulty,
        questions,
        createdBy
    })

    return quiz
}

const getQuizById = async ({ quizId }) => {
    const isValid = mongoose.Types.ObjectId.isValid(quizId)

    if (!isValid) {
        throw new StatusError('ID do Quiz inválido!', 400)
    }

    const quiz = await Quiz.findById(quizId).populate('questions')

    if (!quiz) {
        throw new StatusError('Quiz não encontrado!', 404)
    }

    return quiz
}

const getUserQuizzes = async ({userId, currentUser, category, difficulty}) => {
    const filters = Object.fromEntries(
        Object.entries({
            createdBy: userId,
            category,
            difficulty
        }).filter(([_, value]) => value !== undefined && value !== null)
    )

    const isValid = mongoose.Types.ObjectId.isValid(userId)

    if (!isValid) {
        throw new StatusError('ID do Usuário inválido!', 400)
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new StatusError('Usuário não encontrado!', 404)
    }

    const isOwner = currentUser === userId

    if(!isOwner) {
        throw new StatusError('Você não tem permissão para acessar os quizzes desse usuário!', 403)
    }

    const quizzes = await Quiz.find(filters)

    return quizzes
}

const getAllQuizzes = async () => {
    const quizzes = await Quiz.find({})

    return quizzes
}

const updateQuiz = async ({ quizId, currentUser, updates }) => {
    const isValid = mongoose.Types.ObjectId.isValid(quizId)

    if (!isValid) {
        throw new StatusError('ID do Quiz inválido!', 400)
    }

    const quiz = await Quiz.findByIdAndUpdate(quizId, updates, { new: true })

    if (!quiz) {
        throw new StatusError('Quiz não encontrado!', 404)
    }

    const isOwner = quiz.createdBy.toString() === currentUser

    if(!isOwner) {
        throw new StatusError('Você não tem permissão para atualizar esse quiz!', 403)
    }

    const updatedQuiz = {
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        updatedAt: quiz.updatedAt
    }

    return updatedQuiz
}

const deleteQuiz = async ({ quizId, currentUser }) => {
    const isValid = mongoose.Types.ObjectId.isValid(quizId)

    if (!isValid) {
        throw new StatusError('ID do Quiz inválido!', 400)
    }

    const quiz = await Quiz.findById(quizId)

    if (!quiz) {
        throw new StatusError('Quiz não encontrado!', 404)
    }

    const isOwner = quiz.createdBy.toString() === currentUser

    if(!isOwner) {
        throw new StatusError('Você não tem permissão para deletar esse quiz!', 403)
    }

    await quiz.deleteOne()
}

export default {
    createQuiz,
    getQuizById,
    getUserQuizzes,
    getAllQuizzes,
    updateQuiz,
    deleteQuiz
}