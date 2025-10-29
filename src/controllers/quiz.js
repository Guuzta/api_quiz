import mongoose from "mongoose"

import User from "../models/User.js"
import Quiz from "../models/Quiz.js"
import Attempt from "../models/Attempt.js"

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

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID do Usuário inválido!'
            })
        }

        const user = await User.findById(createdBy)

        if (!user) {
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

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID do Quiz inválido!'
            })
        }

        const quiz = await Quiz.findById(id).populate('questions')

        if (!quiz) {
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

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID do Usuário inválido!'
            })
        }

        const user = await User.findById(id)

        if (!user) {
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

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({})

        res.status(200).json({
            success: true,
            message: 'Quizzes encontrados com sucesso!',
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

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID do Quiz inválido!'
            })
        }

        const quiz = await Quiz.findByIdAndUpdate(id, updates, { new: true })

        if (!quiz) {
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

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'ID do Quiz inválido!'
            })
        }

        const quiz = await Quiz.findByIdAndDelete(id)

        if (!quiz) {
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