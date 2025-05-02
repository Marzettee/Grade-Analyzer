import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { subjects } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async ({ request, params }) => {
	try {
		const id = parseInt(params.id);
		const body = await request.json();
		const { subject_id, subject_name } = body;

		const updatedSubject = await db
			.update(subjects)
			.set({ subject_name, subject_id })
			.where(eq(subjects.id, id))
			.returning();

		if (updatedSubject.length === 0) {
			throw error(404, 'Subject not found');
		}

		return json(updatedSubject[0]);
	} catch (err) {
		console.error('Error updating subject:', err);
		throw error(500, 'Failed to update subject');
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const id = parseInt(params.id);

		if (!id) {
			throw error(400, 'Missing required field: id');
		}

		const deletedSubject = await db.delete(subjects).where(eq(subjects.id, id)).returning();

		if (deletedSubject.length === 0) {
			throw error(404, 'Subject not found');
		}

		return json({ message: 'Subject deleted successfully' });
	} catch (err) {
		console.error('Error deleting subject:', err);
		throw error(500, 'Failed to delete subject');
	}
};
