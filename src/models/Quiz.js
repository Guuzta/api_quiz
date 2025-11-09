import mongoose from 'mongoose'

const { Schema } = mongoose

const quizSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    difficulty: {
        type: String,
        enum: ['fácil', 'médio', 'difícil'],
        required: true,
        lowercase: true
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true 
})

const Quiz = mongoose.model('Quiz', quizSchema)

export default Quiz