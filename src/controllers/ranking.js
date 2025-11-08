import rankingService from '../services/rankingService.js'

const listRanking = async (_, res) => {
    try {
        const ranking = await rankingService.listRanking()

        res.status(200).json({
            success: true,
            message: 'Ranking dos usuários listados com sucesso!',
            ranking
        })
    } catch (error) {
        console.log(error)

        const status = error.statusCode || 500
        const message = error.message

        res.status(status).json({
            success: false,
            message
        })
    }
}

export {
    listRanking
}