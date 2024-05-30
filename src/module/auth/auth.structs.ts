import { object, string, refine } from 'superstruct';

// Custom email validator using a regular expression
const email = refine(string(), 'email', (value) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(value);
});

// Custom password validator to check for letters and numbers
const password = refine(string(), 'password', (value) => {
	const hasLetter = /[a-zA-Z]/.test(value);
	const hasNumber = /[0-9]/.test(value);
	return hasLetter && hasNumber;
});

export const SignUp = object({
	email,
	password,
	nickname: string(),
});

export const SignIn = object({
	email,
	password,
});

export const RefreshToken = object({
	refreshToken: string(),
});

export const isEmail = string();
