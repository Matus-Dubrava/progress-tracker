import React, { useEffect } from 'react';
import { Formik } from 'formik';

import { connect } from 'react-redux';
import { clearFormMessages, createProject } from '../../actions';

const ProjectCreate = ({
	responseErrorMessages,
	clearFormMessages,
	createProject,
}) => {
	// clear authentication error messages when component is unmounted
	// these should not persist when user navigates away
	useEffect(
		() => () => {
			clearFormMessages();
		},
		[]
	);

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
				initialValues={{
					name: '',
					description: '',
				}}
				validate={(values) => {
					const errors = {};
					if (!values.name) {
						errors.name = 'Required';
					}
					if (!values.description) {
						errors.description = 'Required';
					}

					return errors;
				}}
				onSubmit={(values, { setSubmitting }) => {
					console.log('submitting...');
					createProject({
						name: values.name,
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
						<h3>Create Project</h3>

						{responseErrorMessages && (
							<ul className="form-errors-list">
								{renderErrorMessages()}
							</ul>
						)}

						<div className="form-group">
							<label>name</label>
							<input
								type="text"
								name="name"
								className="form-control"
								value={values.name}
								onChange={handleChange}
							/>
							{errors.name && touched.name ? (
								<small className="field-error">
									{errors.name}
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
							Create Project
						</button>
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

export default connect(mapStateToProps, {
	clearFormMessages,
	createProject,
})(ProjectCreate);
