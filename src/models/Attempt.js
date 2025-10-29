import mongoose from 'mongoose'

const { Schema } = mongoose

const attemptSchema = new Schema ({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },

    quizSnapshot: {
        title: { type: String, required: true },
        questionCount: { type: Number, required: true }
    },

    questions: [
        {
            questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
            text: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: Number, required: true },
            shuffledOrder: [{ type: Number, required: true }]
        }
    ],

    answers: [
        {
            questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
            selectedIndex: { type: Number, required: true },
            correct: { type: Boolean, default: false },
            pointsAwarded: { type: Number, default: 0 }
        }
    ],

    score: {
        type: Number,
        default: 0
    },

    totalPossibleScore: {
        type: Number,
        default: 0
    },

    percentage: {
        type: Number,
        default: 0
    },

    startedAt: {
        type: Date,
        default: Date.now
    },

    lastActivityAt: {
        type: Date,
        default: Date.now
    },

    finishedAt: {
        type: Date
    },

    status: {
        type: String,
        enum: [ 'in_progress', 'finished', 'abandoned' ],
        default: 'in_progress'
    },

    abandonedReason: {
        type: String,
        enum: [ 'new_start', 'timeout' ]
    }

})

const Attempt = mongoose.model('Attempt', attemptSchema)

export default Attempt