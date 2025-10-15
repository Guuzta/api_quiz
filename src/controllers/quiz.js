import mongoose from "mongoose"

import Quiz from "../models/Quiz.js"

const createQuiz = async (req, res) => {
    res.json({
        message: 'Testando rota nova!'
    })
}

export {
    createQuiz
}