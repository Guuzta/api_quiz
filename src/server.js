import 'dotenv/config'
import { createRequire } from "module"
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import helmet from 'helmet'
import cors from 'cors'

const require = createRequire(import.meta.url);
const swaggerDocs = require('./docs/swagger.json')

import connectDB from './config/database.js'

import startCronJobs from './cron.js'

import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import questionRoutes from './routes/questions.js'
import quizRoutes from './routes/quizzes.js'
import attemptRoutes from './routes/attempts.js'
import rankingRoutes from './routes/ranking.js'

connectDB()
startCronJobs()

const app = express()

app.use(express.json())
app.use(helmet())
app.use(cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', questionRoutes)
app.use('/api', quizRoutes)
app.use('/api', attemptRoutes)
app.use('/api', rankingRoutes)

const port = process.env.PORT
app.listen(port, () => console.log(`Servidor executando na porta ${port}...`))