import { Router } from 'express'//, Request, Response, NextFunction

const router = Router()

router.get('/', async (req, res) => {
    try {
        return res.json({ test: 123456 })
    } catch (error) {
        throw new Error('Some error in api /')
    }
})

export { router }
