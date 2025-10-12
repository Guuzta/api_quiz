import mongoose from "mongoose"

const { Schema } = mongoose

const questionSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['fácil', 'médio', 'difícil'],
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: (options) => options.length >= 2,
            message: 'A questão deve ter no mínimo duas opções!'
        }
    },
    correctAnswer: {
        type: Number,
        required: true,
        validate: {
            validator: function (answer) {
                return this.options && answer >= 0 && answer < this.options.length
                // Verifica se o índice de opções e resposta são maiores ou igual a 0
                // Verifica se o índice de resposta existe dentro do array de opções
            },
            message: 'O índice da resposta correta é inválido!'
        }
    },
    source: {
        type: String,
        enum: ['manual', 'opentdb'],
        default: 'manual'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps: true
})

const Question = mongoose.model('Question', questionSchema)

export default Question