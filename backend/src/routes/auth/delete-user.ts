import { Router, Request, Response } from 'express';

import { requireAuth } from '../../middleware/require-auth';
import { currentUser } from '../../middleware/current-user';
import { User } from '../../models/user';

const router = Router();

router.delete(
	'/:id',
	currentUser,
	requireAuth,
	async (req: Request, res: Response) => {
		const { id: _id } = req.params;

		await User.deleteOne({ _id });

		req.session = null;

		return res.status(204).send({});
	}
);

export { router as deleteUserRouter };
