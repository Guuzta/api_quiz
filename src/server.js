import 'dotenv/config'
import express from 'express'

import connectDB from './config/database.js'
import authRoutes from './routes/auth.js'

connectDB()

const app = express()
app.use(express.json())

app.use('/auth', authRoutes)

const port = process.env.PORT
app.listen(port, () => console.log(`Servidor executando na porta ${port}...`))