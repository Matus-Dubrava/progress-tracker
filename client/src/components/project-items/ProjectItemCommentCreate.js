import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { clearFormMessages, createComment } from '../../actions';

const ProjectItemCommentCreate = ({
	clearFormMessages,
	responseErrorMessages,
	createComment,
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

	const projectId = match.params.id;
	const itemId = match.params.itemId;

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
		<div>
			<Formik
				initialValues={{ text: '' }}
				validate={(values) => {
					const errors = {};

					if (!values.text) {
						errors.text = 'Text is required';
					} else if (values.text.length <= 15) {
						errors.text = 'At least 15 characters are required';
					}

					return errors;
				}}
				onSubmit={(values, { setSubmitting }) => {
					createComment({ projectId, itemId, text: values.text });
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
						<h3>Create Comment</h3>

						{responseErrorMessages && (
							<ul className="form-errors-list">
								{renderErrorMessages()}
							</ul>
						)}

						<div className="form-group">
							<label>text</label>
							<textarea
								type="text"
								name="text"
								className="form-control"
								value={values.name}
								onChange={handleChange}
							></textarea>
							{errors.text && touched.text ? (
								<small className="field-error">
									{errors.text}
								</small>
							) : null}
						</div>
						<button
							className="btn btn-primary"
							type="submit"
							disabled={isSubmitting}
						>
							Create Comment
						</button>
						<Link
							className="btn btn-outline-primary"
							to={`/projects/${projectId}/items/${itemId}`}
						>
							Cancel
						</Link>
					</form>
				)}
			</Formik>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		responseErrorMessages: state.form,
	};
};

export default connect(mapStateToProps, { clearFormMessages, createComment })(
	ProjectItemCommentCreate
);
