import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { user } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { email, password } = body;

		if (!email || !password) {
			throw error(400, 'Missing required fields');
		}

		const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);

		if (existingUser.length === 0 || existingUser[0].password !== password) {
			throw error(401, 'Invalid email or password');
		}

		return json({
			message: 'Login successful',
			user: {
				id: existingUser[0].id,
				email: existingUser[0].email
			}
		});
	} catch (err) {
		console.error('Login error:', err);
		throw error(500, 'Failed to log in');
	}
};
