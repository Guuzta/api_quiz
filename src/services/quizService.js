import mongoose from "mongoose"

import User from "../models/User.js"
import Quiz from "../models/Quiz.js"
import Attempt from "../models/Attempt.js"

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

    if(!isValid) {
        throw new StatusError('ID do Usuário inválido!', 401)
    }

    const user = await User.findById(createdBy)

    if(!user) {
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

const getQuizById = async({ quizId }) => {
    const isValid = mongoose.Types.ObjectId.isValid(quizId)

    if(!isValid) {
        throw new StatusError('ID do Quiz inválido!', 400)
    }

    const quiz = await Quiz.findById(quizId).populate('questions')

    if(!quiz) {
        throw new StatusError('Quiz não encontrado!', 404)
    }

    return quiz
}

const getUserQuizzes = async(userData, queryParams) => {
    const { userId } = userData
    const { category, difficulty } = queryParams

    const filters = Object.fromEntries(
        Object.entries({
            createdBy: userId,
            category,
            difficulty
        }).filter(([_, value]) => value !== undefined && value !== null)
    )

    const isValid = mongoose.Types.ObjectId.isValid(userId)

    if(!isValid) {
        throw new StatusError('ID do Usuário inválido! [service]', 400)
    }

    const user = await User.findById(userId)

    if(!user) {
        throw new StatusError('Usuário não encontrado!', 404)
    }

    const quizzes = await Quiz.find(filters)

    return quizzes
}

export default { createQuiz, getQuizById, getUserQuizzes }