import React from 'react';
import { Formik } from 'formik';

import './Signup.css';
import { connect } from 'react-redux';
import { signIn } from '../../actions';

const Signin = ({ signIn }) => {
	return (
		<div>
			<Formik
				initialValues={{
					email: '',
					password: '',
				}}
				validate={(values) => {
					const errors = {};
					if (!values.email) {
						errors.email = 'Required';
					} else if (
						!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
							values.email
						)
					) {
						errors.email = 'Invalid email address';
					}

					if (!values.password) {
						errors.password = 'Required';
					}

					return errors;
				}}
				onSubmit={(values, { setSubmitting }) => {
					signIn({ email: values.email, password: values.password });
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
						<h3>Sign In</h3>

						<div className="form-group">
							<label>email</label>
							<input
								type="email"
								name="email"
								className="form-control"
								value={values.email}
								onChange={handleChange}
							/>
							{errors.email && touched.email ? (
								<small className="field-error">
									{errors.email}
								</small>
							) : null}
						</div>
						<div className="form-group">
							<label>password</label>
							<input
								name="password"
								className="form-control"
								type="password"
								value={values.password}
								onChange={handleChange}
							/>
							{errors.password && touched.password ? (
								<small className="field-error">
									{errors.password}
								</small>
							) : null}
						</div>
						<button
							className="btn btn-primary"
							type="submit"
							disabled={isSubmitting}
						>
							Sign In
						</button>
					</form>
				)}
			</Formik>
		</div>
	);
};

export default connect(null, { signIn })(Signin);
