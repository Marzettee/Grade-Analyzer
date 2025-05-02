import type { RequestHandler } from './$types';
import { user } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	try {
		const data = await db.select().from(user);

		return json({
			data: data
		});
	} catch (err) {
		console.error(err);
		throw error(500, 'Failed to fetch users');
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { email, password } = body;

		if (!email || !password) {
			throw error(400, 'Missing required fields');
		}

		const newUser = await db.insert(user).values({ email, password });

		return json({
			data: newUser
		});
	} catch (err) {
		console.error(err);
		throw error(500, 'Failed to create user');
	}
};
