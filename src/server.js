import 'dotenv/config'
import express from 'express'

import connectDB from './config/database.js'

import routes from './routes/index.js'

connectDB()

const app = express()
app.use(express.json())

app.use('/api', routes)

const port = process.env.PORT
app.listen(port, () => console.log(`Servidor executando na porta ${port}...`))