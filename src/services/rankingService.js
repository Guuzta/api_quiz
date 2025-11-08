import Attempt from "../models/Attempt.js"

const listRanking = async () => {
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

    return ranking
}

export default {
    listRanking
}