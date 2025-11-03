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

export default { createQuiz }