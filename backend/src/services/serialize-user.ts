import { UserDocument } from '../models/user';

interface SerializedUser {
	name: string;
	email: string;
	id: string;
}

export const serializeUser = (user: UserDocument): SerializedUser => {
	return {
		name: user.name,
		email: user.email,
		id: user._id,
	};
};
