import mongoose from 'mongoose';

import { PasswordManager } from '../services/password-manager';

interface UserAttrs {
	email: string;
	password: string;
	name: string;
}

interface UserModel extends mongoose.Model<UserDocument> {
	build(attrs: UserAttrs): UserDocument;
}

interface UserDocument extends mongoose.Document {
	email: string;
	name: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await PasswordManager.toHash(this.get('password'));
		this.set('password', hashed);
	}
	done();
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };
