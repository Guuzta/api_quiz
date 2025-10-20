import mongoose from "mongoose"

import User from "../models/User.js"
import Quiz from "../models/Quiz.js"

const createQuiz = async (req, res) => {
    const {
        title,
        description,
        category,
        difficulty,
        questions,
        createdBy
    } = req.body

    try {
        const isValid = mongoose.Types.ObjectId.isValid(createdBy)

        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID do Usuário inválido!'
            })
        }

        const user = await User.findById(createdBy)

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado!'
            })
        }

        const quiz = new Quiz({
            title,
            description,
            category,
            difficulty,
            questions,
            createdBy
        })

        await quiz.save()

        res.status(201).json({
            success: true,
            message: 'Quiz criado com sucesso!',
            quiz
        })
    } catch (error) {
        console.log('Erro interno no servidor ao tentar criar quiz!', error)
        
        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao tentar criar quiz!'
        })
    }
}

const getQuizById = async (req, res) => {
    const { id } = req.params

    try {
        const isValid = mongoose.Types.ObjectId.isValid(id)

        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID do Quiz inválido!'
            })
        }

        const quiz = await Quiz.findById(id).populate('questions')

        if(!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz não encontrado!'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Quiz encontrado com sucesso!',
            quiz
        })
    } catch (error) {
        console.log('Erro interno no servidor ao buscar Quiz!', error)

        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao buscar Quiz!'
        })
    }
}

const getUserQuizzes = async (req, res) => {
    const { id } = req.params
    const { category, difficulty } = req.query

    const filters = Object.fromEntries(
        Object.entries({
            createdBy: id,
            category,
            difficulty
        }).filter(([key, value]) => value !== undefined && value !== null)
    )

    try {
        const isValid = mongoose.Types.ObjectId.isValid(id)

        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID do Usuário inválido!'
            })
        }

        const user = await User.findById(id)

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado!'
            })
        }

        const quizzes = await Quiz.find(filters)

        res.status(200).json({
            success: true,
            quizzes
        })

    } catch (error) {
        console.log('Erro interno no servidor ao buscar Quizzes!', error)

        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao buscar Quizzes!'
        })
    }
}

const updateQuiz = async (req, res) => {
    const { id } = req.params
    const updates = req.updates

    try {
        const isValid = mongoose.Types.ObjectId.isValid(id)

        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID do Quiz inválido!'
            })
        }

        const quiz = await Quiz.findByIdAndUpdate(id, updates, { new: true })

        if(!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz não encontrado!'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Quiz atualizado com sucesso!',
            updatedQuiz: quiz
        })
        
    } catch (error) {
        console.log('Erro interno no servidor ao atualizar questão!', error)

        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao atualizar questão!'
        })
    }
}

const deleteQuiz = async (req, res) => {
    const { id } = req.params

    try {
        const isValid = mongoose.Types.ObjectId.isValid(id)

        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID do Quiz inválido!'
            })
        }

        const quiz = await Quiz.findByIdAndDelete(id)

        if(!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz não encontrado!'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Quiz deletado com sucesso!'
        })
    } catch (error) {
        console.log('Erro interno no servidor ao deletar quiz!', error)

        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao deletar quiz!'
        })
    }
}

export {
    createQuiz,
    getQuizById,
    getUserQuizzes,
    updateQuiz,
    deleteQuiz
}