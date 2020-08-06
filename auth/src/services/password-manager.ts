import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const HASH_ROUNDS = 64;

export class PasswordManager {
	static async toHash(password: string): Promise<string> {
		const salt = randomBytes(8).toString('hex');
		const buf = (await scryptAsync(password, salt, HASH_ROUNDS)) as Buffer;
		return `${buf.toString('hex')}.${salt}`;
	}

	static async compare(
		storedPassword: string,
		suppliedPassword: string
	): Promise<boolean> {
		const [hashedPassword, salt] = storedPassword.split('.');
		const buf = (await scryptAsync(
			suppliedPassword,
			salt,
			HASH_ROUNDS
		)) as Buffer;
		return buf.toString() === hashedPassword;
	}
}
