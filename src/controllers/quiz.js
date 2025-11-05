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
    try {
        const { attemptId, quizSnapshot, questions } = await quizService.startQuiz(req.params, req.user.sub)

        res.status(201).json({
            success: true,
            message: 'Nova tentativa criada com sucesso!',
            attemptId,
            quizSnapshot,
            questions
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

export {
    createQuiz,
    getQuizById,
    getUserQuizzes,
    getAllQuizzes,
    updateQuiz,
    deleteQuiz,
    startQuiz
}