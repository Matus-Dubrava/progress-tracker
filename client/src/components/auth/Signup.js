import React, { useState } from 'react';

import './Signup.css';
import { connect } from 'react-redux';
import { signUp } from '../../actions';

const Signup = ({ signUp }) => {
	// field value state
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [repeatedPassword, setRepeatedPassword] = useState('');

	// field error state
	const [emailError, setEmailError] = useState('');
	const [nameError, setNameError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [repeatedPasswordError, setRepeatedPasswordError] = useState('');

	const validateForm = () => {
		let isValid = true;

		if (!email.length) {
			setEmailError('Email is required');
			isValid = false;
		}

		if (!name.length) {
			setNameError('Name is required');
			isValid = false;
		}

		if (!password.length) {
			setPasswordError('Password is required');
			isValid = false;
		}

		if (!repeatedPassword.length) {
			setRepeatedPasswordError('Password is required');
			isValid = false;
		}

		if (password.length < 8) {
			setPasswordError('Password must be at least 8 characters long');
			isValid = false;
		}

		if (password !== repeatedPassword) {
			setRepeatedPasswordError('Provided passwords do not match');
			isValid = false;
		}

		return isValid;
	};

	const onSubmit = (event) => {
		event.preventDefault();

		console.log(
			`submitting name: ${name}, email: ${email}, password: ${password}`
		);

		if (validateForm()) {
			signUp(name, email, password);
		}
	};

	const onChange = (event) => {
		switch (event.target.name) {
			case 'email':
				setEmail(event.target.value);
				setEmailError('');
				break;
			case 'name':
				setName(event.target.value);
				setNameError('');
				break;
			case 'password':
				setPassword(event.target.value);
				setPasswordError('');
				break;
			case 'repeated-password':
				setRepeatedPassword(event.target.value);
				setRepeatedPasswordError('');
				break;
			default:
				return;
		}
	};

	return (
		<div>
			<form className="form" onSubmit={onSubmit}>
				<h3>Sign Up</h3>
				<div className="form-group">
					<label>email</label>
					<input
						name="email"
						className="form-control"
						type="text"
						value={email}
						onChange={onChange}
					/>
					{emailError ? (
						<small className="field-error">{emailError}</small>
					) : null}
				</div>
				<div className="form-group">
					<label>name</label>
					<input
						name="name"
						className="form-control"
						type="text"
						value={name}
						onChange={onChange}
					/>
					{nameError ? (
						<small className="field-error">{nameError}</small>
					) : null}
				</div>
				<div className="form-group">
					<label>password</label>
					<input
						name="password"
						className="form-control"
						type="password"
						value={password}
						onChange={onChange}
					/>
					{passwordError ? (
						<small className="field-error">{passwordError}</small>
					) : null}
				</div>
				<div className="form-group">
					<label>repeat password</label>
					<input
						name="repeated-password"
						className="form-control"
						type="password"
						value={repeatedPassword}
						onChange={onChange}
					/>
					{repeatedPasswordError ? (
						<small className="field-error">
							{repeatedPasswordError}
						</small>
					) : null}
				</div>
				<button className="btn btn-primary">Sign Up</button>
			</form>
		</div>
	);
};

export default connect(null, { signUp })(Signup);
