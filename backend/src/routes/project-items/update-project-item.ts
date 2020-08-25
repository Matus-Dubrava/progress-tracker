import { Router, Request, Response } from 'express';

import { requireAuth } from '../../middleware/require-auth';
import { currentUser } from '../../middleware/current-user';
import { validateMongoId } from '../../middleware/validate-mongo-id';
import {
	ProjectItem,
	ProjectItemCategory,
	ProjectItemDocument,
} from '../../models/project-item';
import { Project } from '../../models/project';
import { CustomRequestValidationError } from '../../errors/custom-request-validation-error';
import { NotFoundError } from '../../errors/not-found-error';
import { serializeProjectItem } from '../../services/serialize-project-item';

const router = Router();

router.post(
	'/projects/:projectId/items/:itemId',
	(req: Request, res: Response) => {
		return res.send('item updated');
	}
);

export { router as updateProjectItemRouter };
