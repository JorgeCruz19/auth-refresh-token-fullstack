import 'dotenv/config';

export const env = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
	ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE || '1m',
	REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE || '7d',
	COOKIE_SECRET: process.env.COOKIE_SECRET,
};
