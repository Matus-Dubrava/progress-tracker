import request from 'supertest';

import { app } from '../../../app';
import { config as userConfig } from '../../auth/__test__/config';
import { config as projectConfig } from '../../projects/__test__/config';
import { config as projectItemConfig } from './config';
import { createProject } from '../../projects/__test__/helpers';
import {
	createProjectItem,
	createProjectItemComment,
	updateProjectItemComment,
	fetchProjectItem,
	fetchProject,
} from './helpers';
import { parseCookieFromResponse } from '../../auth/__test__/helpers';

let cookieUserA: string;
let cookieUserB: string;
let projectIdUserA: string;
let projectItemIdUserA: string;

beforeEach(async () => {
	let response = await request(app)
		.post(userConfig.signupPostUrl)
		.send({
			name: userConfig.testName,
			email: userConfig.testEmail,
			password: userConfig.testPassword,
		})
		.expect(201);

	cookieUserA = parseCookieFromResponse(response);

	response = await request(app)
		.post(userConfig.signupPostUrl)
		.send({
			name: userConfig.testName,
			email: userConfig.testEmail2,
			password: userConfig.testPassword,
		})
		.expect(201);

	cookieUserB = parseCookieFromResponse(response);

	response = await createProject(cookieUserA, projectConfig.testProjectName1);
	projectIdUserA = response.body.id;

	response = await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryTask,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});

	projectItemIdUserA = response.body.id;
});

it('should update comment successfully, dateCreated should be left untouched, updated project item should be returned', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});
	const commentId = response.body.comments[0].id;
	const dateCreated = response.body.comments[0].dateCreated;

	response = await updateProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId: commentId,
		text: projectItemConfig.commentText2,
		expect: 200,
	});

	expect(response.body.comments.length).toEqual(1);
	expect(response.body.comments[0].text).toEqual(
		projectItemConfig.commentText2
	);
	expect(response.body.comments[0].dateCreated).toEqual(dateCreated);
});

it('should not affect other comments', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});
	const comment1Id = response.body.comments[0].id;

	response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	const dateCreated = response.body.comments[1].dateCreated;

	response = await updateProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId: comment1Id,
		text: projectItemConfig.commentText2,
		expect: 200,
	});

	expect(response.body.comments.length).toEqual(2);
	expect(response.body.comments[1].text).toEqual(
		projectItemConfig.commentText1
	);
	expect(response.body.comments[1].dateCreated).toEqual(dateCreated);
});

it('should update project item dateUpdated attribute', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});
	const commentId = response.body.comments[0].id;

	response = await fetchProjectItem({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		expect: 200,
	});

	const oldDateUpdated = response.body.dateUpdated;

	response = await updateProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId,
		text: projectItemConfig.commentText2,
		expect: 200,
	});

	response = await fetchProjectItem({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		expect: 200,
	});

	expect(response.body.dateUpdated).not.toEqual(oldDateUpdated);
});

it('should update project dateUpdated attribute', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});
	const commentId = response.body.comments[0].id;

	response = await fetchProject({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		expect: 200,
	});

	const oldDateUpdated = response.body.dateUpdated;

	response = await updateProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId,
		text: projectItemConfig.commentText2,
		expect: 200,
	});

	response = await fetchProject({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		expect: 200,
	});

	expect(response.body.dateUpdated).not.toEqual(oldDateUpdated);
});

it('should return 422 if comment with given ID does not exist', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	await updateProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId: projectConfig.testProjectId,
		text: projectItemConfig.commentText2,
		expect: 422,
	});
});

it('should return 422 if comment ID is not in a valid mongodb format', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	await updateProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId: projectConfig.testProjectInvalidId,
		text: projectItemConfig.commentText2,
		expect: 422,
	});
});

it('should return 422 if project item with given ID does not exist', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	const commentId = response.body.comments[0].id;

	await updateProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectConfig.testProjectId,
		commentId,
		text: projectItemConfig.commentText2,
		expect: 422,
	});
});

it('should return 422 if project item ID is not in a valid mongodb format', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	const commentId = response.body.comments[0].id;

	await updateProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectConfig.testProjectInvalidId,
		commentId,
		text: projectItemConfig.commentText2,
		expect: 422,
	});
});

it('should return 422 if project with given ID does not exist', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	const commentId = response.body.comments[0].id;

	await updateProjectItemComment({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectId,
		itemId: projectItemIdUserA,
		commentId,
		text: projectItemConfig.commentText2,
		expect: 422,
	});
});

it('should return 422 if project ID is not in valid mongodb format', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	const commentId = response.body.comments[0].id;

	await updateProjectItemComment({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectInvalidId,
		itemId: projectItemIdUserA,
		commentId,
		text: projectItemConfig.commentText2,
		expect: 422,
	});
});

it('should return 403 if user is not signed in', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	const commentId = response.body.comments[0].id;

	await updateProjectItemComment({
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId,
		text: projectItemConfig.commentText2,
		expect: 403,
	});
});

it('should return 403 if user is not the owner of the project', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	const commentId = response.body.comments[0].id;

	await updateProjectItemComment({
		cookie: cookieUserB,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId,
		text: projectItemConfig.commentText2,
		expect: 403,
	});
});

it('should return 422 it attribute [text] is not specified', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	const commentId = response.body.comments[0].id;

	await updateProjectItemComment({
		cookie: cookieUserB,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId,
		expect: 422,
	});
});

it('should return 422 it attribute [text] is not at least 15 characters long', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	const commentId = response.body.comments[0].id;

	await updateProjectItemComment({
		cookie: cookieUserB,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId,
		text: projectItemConfig.invalidCommentText,
		expect: 422,
	});
});

// it("should return 403 if project is closed", async () => {
//     let response = await createProjectItemComment(
// 		cookieUserA,
// 		projectIdUserA,
// 		projectItemIdUserA,
// 		projectItemConfig.commentText1
//     );

//     const commentId = response.body.comments[0].id;

// TODO: update project status

//     await updateProjectItemComment({
// 		cookie: cookieUserA,
// 		projectId: projectIdUserA,
// 		itemId: projectItemIdUserA,
// 		commentId,
// 		text: projectItemConfig.invalidCommentText,
// 		expect: 422,
// 	});
// });
