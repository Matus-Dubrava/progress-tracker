import { Router, Request, Response } from 'express'

const router = Router()

router.delete(`/projects/:projectId/items/:itemId/comments/:commentId`, (req: Request, res: Response) => {
    return res.send("comment deleted");
})

export { router as projectItemDeleteCommentRouter }