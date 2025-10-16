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

export {
    createQuiz,
    getQuizById
}