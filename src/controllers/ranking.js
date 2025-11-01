import mongoose from "mongoose"

import Attempt from "../models/Attempt.js"

const listRanking = async (req, res) => {
    try {
        const ranking = await Attempt.aggregate([
            {
                $group: {
                    _id: '$userId',
                    totalPoints: { $sum: '$score' }
                }
            },

            {
                $sort: { totalPoints: -1 }
            },

            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },

            { $unwind: '$user' },

            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    name: '$user.name',
                    totalPoints: 1
                }
            }
            
        ])

        res.status(200).json({
            success: true,
            message: 'Ranking dos usuários listados com sucesso!',
            ranking
        })
    } catch (error) {
        console.log('Erro interno no servidor ao listar ranking!', error)

        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor ao listar ranking!'
        })
    }
}

export {
    listRanking
}