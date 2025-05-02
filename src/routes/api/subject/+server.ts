import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { subjects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { subject_name, subject_id } = body;

		if (!subject_name) {
			throw error(400, 'Missing required field: subject_name');
		}

		const newSubject = await db.insert(subjects).values({ subject_name, subject_id }).returning();

		return json(newSubject[0], { status: 201 });
	} catch (err) {
		console.error('Error creating subject:', err);
		throw error(500, 'Failed to create subject');
	}
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const id = url.searchParams.get('id');

		if (id) {
			const subject = await db
				.select()
				.from(subjects)
				.where(eq(subjects.id, parseInt(id)))
				.limit(1);

			if (subject.length === 0) {
				throw error(404, 'Subject not found');
			}
			return json(subject[0]);
		}

		const allSubjects = await db.select().from(subjects);
		return json(allSubjects);
	} catch (err) {
		console.error('Error fetching subjects:', err);
		throw error(500, 'Failed to fetch subjects');
	}
};
