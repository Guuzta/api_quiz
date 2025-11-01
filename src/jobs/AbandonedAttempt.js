import Attempt from "../models/Attempt.js"

const INACTIVITY_LIMIT_MS = 10 * 60 * 1000

const verifyAbandonedAttempts = async () => {
    const timeLimit = new Date (Date.now() - INACTIVITY_LIMIT_MS)

    const abandonedAttempts = await Attempt.updateMany(
        { status: 'in_progress', lastActivityAt: { $lt: timeLimit } },
        {
            $set: {
                status: 'abandoned',
                finishedAt: Date.now(),
                abandonedReason: 'timeout'
            }
        }
    )

    console.log(`[CronJob] - ${abandonedAttempts.modifiedCount} attempt(s) marcado(s) como abandonado!`)
}

export default verifyAbandonedAttempts