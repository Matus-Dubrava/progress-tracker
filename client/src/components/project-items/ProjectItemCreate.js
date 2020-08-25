import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { clearFormMessages, createProjectItem } from '../../actions';

const ProjectItemCreate = ({
	createProjectItem,
	clearFormMessages,
	responseErrorMessages,
	location,
	match,
}) => {
	// clear authentication error messages when component is unmounted
	// these should not persist when user navigates away
	useEffect(
		() => () => {
			clearFormMessages();
		},
		[]
	);

	// item category is passed via query string parameter
	const itemCategory = location.search.split('=')[1];

	const projectId = match.params.id;

	const renderErrorMessages = () => {
		return responseErrorMessages.map(({ message }) => {
			return (
				<li className="form-errors-item" key={message}>
					{message}
				</li>
			);
		});
	};

	return (
		<Formik
			initialValues={{
				title: '',
				description: '',
				category: itemCategory,
			}}
			validate={(values) => {
				const errors = {};

				if (!values.title) {
					errors.title = 'Title is required';
				}
				if (!values.description) {
					errors.description = 'Description is required';
				}

				if (values.category !== 'task' && values.category !== 'issue') {
					errors.description = 'Invalid category';
				}
				return errors;
			}}
			onSubmit={(values, { setSubmitting }) => {
				createProjectItem({
					projectId,
					category: values.category,
					title: values.title,
					description: values.description,
				});

				setSubmitting(false);
			}}
		>
			{({
				isSubmitting,
				values,
				errors,
				touched,
				handleChange,
				handleSubmit,
			}) => (
				<form className="form" onSubmit={handleSubmit}>
					<h3>Create {itemCategory}</h3>

					{responseErrorMessages && (
						<ul className="form-errors-list">
							{renderErrorMessages()}
						</ul>
					)}

					<div className="form-group">
						<label>title</label>
						<input
							type="text"
							name="title"
							className="form-control"
							value={values.title}
							onChange={handleChange}
						/>
						{errors.title && touched.title ? (
							<small className="field-error">
								{errors.title}
							</small>
						) : null}
					</div>
					<div className="form-group">
						<label>description</label>
						<input
							name="description"
							className="form-control"
							type="text"
							value={values.description}
							onChange={handleChange}
						/>
						{errors.description && touched.description ? (
							<small className="field-error">
								{errors.description}
							</small>
						) : null}
					</div>
					<button
						className="btn btn-primary"
						type="submit"
						disabled={isSubmitting}
					>
						Create {itemCategory}
					</button>
					<Link
						className="btn btn-outline-primary ml-2"
						to={`/projects/${projectId}`}
					>
						Cancel
					</Link>
				</form>
			)}
		</Formik>
	);
};

const mapStateToProps = (state) => {
	return {
		responseErrorMessages: state.form,
	};
};

export default connect(mapStateToProps, {
	clearFormMessages,
	createProjectItem,
})(ProjectItemCreate);
