import { PasswordManager } from '../password-manager';

it('compare should return true if passwords match', async () => {
	const password = 'testpassword';
	const hashed = await PasswordManager.toHash(password);
	const result = await PasswordManager.compare(hashed, password);
	expect(result).toBeTruthy();
});

it('compare should return false if passwords do not match', async () => {
	const password1 = 'testpassword';
	const password2 = 'anotherpassword';
	const hashed = await PasswordManager.toHash(password1);
	const result = await PasswordManager.compare(hashed, password2);
	expect(result).toBeFalsy();
});
