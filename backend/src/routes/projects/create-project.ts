import { Router } from 'express';

import { Project } from '../../models/project';

const router = Router();

router.post('/projects', async (req, res) => {
	try {
		const project = await Project.build({
			name: 'test project1',
			description: 'for testing purposes',
			ownerId: '5f3920ddd4984d006a102360',
		}).save();

		console.log(project);
	} catch (err) {
		console.log(err);
	}

	return res.status(201).send('Testing project creation');
});

export { router as createProjectRouter };
