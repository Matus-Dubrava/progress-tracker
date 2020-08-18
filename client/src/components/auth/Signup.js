import React from 'react';
import { Formik } from 'formik';

import './Signup.css';
import { connect } from 'react-redux';
import { signUp } from '../../actions';

const Signup = ({ signUp }) => {
	return (
		<div>
			<Formik
				initialValues={{
					email: '',
					name: '',
					password: '',
					repeatedPassword: '',
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

					if (!values.name) {
						errors.name = 'Required';
					}

					if (!values.password) {
						errors.password = 'Required';
					} else if (values.password.length < 8) {
						errors.password =
							'Short password (at least 8 characters are required)';
					}

					if (!values.repeatedPassword) {
						errors.repeatedPassword = 'Required';
					} else if (values.password !== values.repeatedPassword) {
						errors.repeatedPassword = 'Passwords do not match';
					}

					return errors;
				}}
				onSubmit={(values, { setSubmitting }) => {
					signUp(values.name, values.email, values.password);
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
						<h3>Sign Up</h3>

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
							<label>name</label>
							<input
								name="name"
								className="form-control"
								type="text"
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
						<div className="form-group">
							<label>repeat password</label>
							<input
								name="repeatedPassword"
								className="form-control"
								type="password"
								value={values.repeatedPassword}
								onChange={handleChange}
							/>
							{errors.repeatedPassword &&
							touched.repeatedPassword ? (
								<small className="field-error">
									{errors.repeatedPassword}
								</small>
							) : null}
						</div>
						<button
							className="btn btn-primary"
							type="submit"
							disabled={isSubmitting}
						>
							Sign Up
						</button>
					</form>
				)}
			</Formik>
		</div>
	);
};

export default connect(null, { signUp })(Signup);
