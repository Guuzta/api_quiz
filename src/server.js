import 'dotenv/config'
import express from 'express'

import connectDB from './config/database.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'

connectDB()

const app = express()
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)

const port = process.env.PORT
app.listen(port, () => console.log(`Servidor executando na porta ${port}...`))