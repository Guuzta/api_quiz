import cron from 'node-cron'

import verifyAbandonedAttempts from './jobs/AbandonedAttempt.js'

const startCronJobs = async () => {
    cron.schedule('* * * * *', async () => {
        await verifyAbandonedAttempts()
    })
}

export default startCronJobs