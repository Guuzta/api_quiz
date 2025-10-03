import 'dotenv/config'
import express from 'express'
import connectDB from './config/database.js'

connectDB()

const app = express()

app.get('/', (req, res) => {
    res.send('Hello world!')
})

const port = process.env.PORT
app.listen(port, () => console.log(`Servidor executando na porta ${port}...`))