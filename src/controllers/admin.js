import Question from "../models/question.js"

import questionSchema from "../validations/question.js"

const createQuestion = async (req, res) => {
     const {
          text,
          category,
          difficulty,
          options,
          correctAnswer,
          source,
          createdBy
     } = req.body

     try {
          await questionSchema.validate(req.body, { abortEarly: false })
     } catch (error) {
          const { errors } = error

          return res.status(400).json({
               success: false,
               errors
          })
     }

     try {

          const question = new Question({
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
          console.log('Erro ao tentar salvar questão!', error)

          res.status(500).json({
               success: false,
               message: 'Erro interno no servidor ao tentar criar questão!'
          })
     }


}

export { createQuestion }