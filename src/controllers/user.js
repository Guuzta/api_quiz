import mongoose from "mongoose"

import User from "../models/users.js"
import Quiz from "../models/quiz.js"
import Question from "../models/question.js"

const createQuestion = async (req, res) => {
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

        const user = await User.findById(createdBy)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado!'
            })
        }

        const isValid = mongoose.Types.ObjectId.isValid(quizId)

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID do Quiz inválido!'
            })
        }

        const quiz = await Quiz.findById(quizId)

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz não encontrado!'
            })
        }

        const question = new Question({
            quizId,
            text,
            category,
            difficulty,
            options,
            correctAnswer,
            source,
            createdBy
        })

        await question.save()

        res.status(201).json({
            success: true,
            message: 'Questão criada com sucesso!',
            question
        })
    } catch (error) {
        console.log('Erro interno no servidor ao criar questão!', error)

        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao criar questão!'
        })
    }


}

const getQuestionById = async (req, res) => {
    const { id } = req.params

    try {
        const isValid = mongoose.Types.ObjectId.isValid(id)

        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID da Questão inválido!'
            })
        }

        const question = await Question.findById(id)

        if(!question) {
            return res.status(404).json({
                success: false,
                message: 'Questão não encontrada!'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Questão encontrada com sucesso!',
            question
        })
    } catch (error) {
        console.log('Erro interno no servidor ao buscar questão!', error)

        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao buscar questão!'
        })
    }
}

export {
    createQuestion,
    getQuestionById
}