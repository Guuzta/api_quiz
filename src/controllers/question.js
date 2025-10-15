import mongoose from "mongoose"

import User from "../models/User.js"
import Quiz from "../models/Quiz.js"
import Question from "../models/Question.js"

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

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID da Questão inválida!'
            })
        }

        const question = await Question.findById(id)

        if (!question) {
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

const updateQuestion = async (req, res) => {
    const { id } = req.params
    const updates = req.updates

    try {
        const isValid = mongoose.Types.ObjectId.isValid(id)

        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID da Questão inválida!'
            })
        }

        const question = await Question.findById(id)

        if(!question) {
            return res.status(404).json({
                success: false,
                message: 'Questão não encontrada!'
            })
        }

        Object.assign(question, updates)
        const updatedQuestion = await question.save()

        res.status(200).json({
            success: true,
            message: 'Questão atualizada com sucesso!',
            updatedQuestion
        })
    } catch (error) {
        console.log('Erro interno no servidor ao atualizar questão!', error)

        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao atualizar questão!'
        })
    }
}

const deleteQuestion = async (req, res) => {
    const { id } = req.params

    try {
        const isValid = mongoose.Types.ObjectId.isValid(id)

        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID da Questão inválida!'
            })
        }

        const question = await Question.findByIdAndDelete(id)

        if(!question) {
            return res.status(404).json({
                success: false,
                message: 'Questão não encontrada!'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Questão deletada com sucesso!'
        })
    } catch (error) {
        console.log('Erro interno no servidor ao deletar questão!', error)

        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao deletar questão!'
        })
    }
}

export {
    createQuestion,
    getQuestionById,
    updateQuestion,
    deleteQuestion
}