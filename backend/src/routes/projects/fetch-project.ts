import { Router, Request, Response } from 'express'

const router = Router()

router.get('/projects/:id', (req: Request, res:Response) => {
    return res.send("project1");
})

export { router as fetchProjectRouter }