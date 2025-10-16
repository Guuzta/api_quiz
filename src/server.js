import 'dotenv/config'
import express from 'express'

import connectDB from './config/database.js'

import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import questionRoutes from './routes/questions.js'
import quizRoutes from './routes/quizzes.js'

connectDB()

const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', questionRoutes)
app.use('/api', quizRoutes)

const port = process.env.PORT
app.listen(port, () => console.log(`Servidor executando na porta ${port}...`))