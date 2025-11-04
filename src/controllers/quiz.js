import mongoose from "mongoose"

import User from "../models/User.js"
import Quiz from "../models/Quiz.js"
import Attempt from "../models/Attempt.js"

import quizService from '../services/quizService.js'

const createQuiz = async (req, res) => {
    try {
        const quiz = await quizService.createQuiz(req.body)

        res.status(201).json({
            success: true,
            message: 'Quiz criado com sucesso!',
            quiz
        })
    } catch (error) {
        console.log(error)

        const status = error.statusCode || 500
        const message = error.message

        res.status(status).json({
            success: false,
            message
        })
    }
}

const getQuizById = async (req, res) => {
    try {
        const quiz = await quizService.getQuizById(req.params)

        res.status(200).json({
            success: true,
            message: 'Quiz encontrado com sucesso!',
            quiz
        })
    } catch (error) {
        console.log(error)

        const status = error.statusCode || 500
        const message = error.message

        res.status(status).json({
            success: false,
            message,
        })
    }
}

const getUserQuizzes = async (req, res) => {
    try {
        const quizzes = await quizService.getUserQuizzes(req.params, req.query)

        res.status(200).json({
            success: true,
            quizzes
        })

    } catch (error) {
        console.log(error)

        const status = error.statusCode || 500
        const message = error.message

        res.status(status).json({
            success: false,
            message
        })
    }
}

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await quizService.getAllQuizzes()

        res.status(200).json({
            success: true,
            message: 'Quizzes encontrados com sucesso!',
            quizzes
        })
    } catch (error) {
        console.log(error)

        const status = error.statusCode || 500
        const message = error.message

        res.status(message).json({
            success: false,
            message
        })
    }
}

const updateQuiz = async (req, res) => {
    try {
        const updatedQuiz = await quizService.updateQuiz(req.params, req.updates)

        res.status(200).json({
            success: true,
            message: 'Quiz atualizado com sucesso!',
            updatedQuiz
        })

    } catch (error) {
        console.log(error)

        const status = error.statusCode || 500
        const message = error.message

        res.status(status).json({
            success: false,
            message
        })
    }
}

const deleteQuiz = async (req, res) => {
    try {
        await quizService.deleteQuiz(req.params)

        res.status(200).json({
            success: true,
            message: 'Quiz deletado com sucesso!'
        })
    } catch (error) {
        console.log(error)

        const status = error.statusCode || 500
        const message = error.message

        res.status(status).json({
            success: false,
            message
        })
    }
}

const startQuiz = async (req, res) => {
    const { quizId } = req.params
    const userId = req.user.sub

    try {
        await Attempt.updateMany(
            {userId, status: 'in_progress'},
            {
                $set: {
                    status: 'abandoned',
                    finishedAt: Date.now(),
                    abandonedReason: 'new_start'
                }
            }
        )

        const isValid = mongoose.Types.ObjectId.isValid(quizId)

        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID do Quiz inválido!'
            })
        }

        const quiz = await Quiz.findById(quizId).populate('questions')

        if(!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz não encontrado!'
            })
        }
        
        const existingAttempt = await Attempt.findOne({
            userId,
            quizId,
            status: 'in_progress'
        })

        if(existingAttempt) {
            return res.status(400).json({
                success: false,
                message: 'Esse Quiz já possui uma tentativa em andamento!',
                attemptId: existingAttempt._id
            })
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

        res.status(201).json({
            success: true,
            message: 'Nova tentativa criada com sucesso!',
            attemptId: attempt._id,
            quizSnapshot: attempt.quizSnapshot,
            questions: safeQuestions
        })
        
    } catch (error) {
        console.log('Erro interno no servidor ao iniciar Quiz!', error)

        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao iniciar Quiz!'
        })
    }
}

export {
    createQuiz,
    getQuizById,
    getUserQuizzes,
    getAllQuizzes,
    updateQuiz,
    deleteQuiz,
    startQuiz
}