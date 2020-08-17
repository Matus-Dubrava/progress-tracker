import React, { useState } from 'react';

import { connect } from 'react-redux';
import { signUp } from '../../actions';

const Signup = ({ signUp }) => {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [repeatedPassword, setRepeatedPassword] = useState('');

	const onSubmit = (event) => {
		event.preventDefault();

		console.log(
			`submitting name: ${name}, email: ${email}, password: ${password}`
		);

		signUp(name, email, password);
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<div>
					<label>email</label>
					<input
						type="text"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>
				</div>
				<div>
					<label>name</label>
					<input
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
					/>
				</div>
				<div>
					<label>password</label>
					<input
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>
				</div>
				<div>
					<label>repeat password</label>
					<input
						type="password"
						value={repeatedPassword}
						onChange={(event) =>
							setRepeatedPassword(event.target.value)
						}
					/>
				</div>
				<button>Sign Up</button>
			</form>
		</div>
	);
};

export default connect(null, { signUp })(Signup);
