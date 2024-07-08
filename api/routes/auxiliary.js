import { Router } from 'express'

const router = Router()

router.get('/wakeup', async (req, res) => {
    try {
        return res.json({ wakeup_result: 'OK' })
    } catch (error) {
        throw new Error('Some error in api /')
    }
})

export default router
