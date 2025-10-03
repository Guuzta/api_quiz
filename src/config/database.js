import mongoose from 'mongoose'
import 'dotenv/config'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Conexão com o banco de dados estabelecida com sucesso!')
    } catch (error) {
        console.log('Erro ao se conectar com o banco de dados!', error)
    }
}

export default connectDB