import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { grades, students, subjects } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async ({ request, params }) => {
	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			throw error(400, 'Invalid grade ID');
		}

		const body = await request.json();
		const { grade } = body;

		if (grade === undefined) {
			throw error(400, 'Missing required field: grade');
		}

		if (grade !== undefined && (!Number.isInteger(grade) || grade < 0 || grade > 100)) {
			throw error(400, 'Grade must be an integer between 0 and 100');
		}

		const updatedGrade = await db
			.update(grades)
			.set({
				grade
			})
			.where(eq(grades.id, id))
			.returning();

		if (updatedGrade.length === 0) {
			throw error(404, 'Grade not found');
		}

		return json(updatedGrade[0]);
	} catch (err) {
		console.error('Error updating grade:', err);
		throw error(500, 'Failed to update grade');
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const id = parseInt(params.id);

		if (!id) {
			throw error(400, 'Missing required field: id');
		}

		const deletedGrade = await db.delete(grades).where(eq(grades.id, id)).returning();

		if (deletedGrade.length === 0) {
			throw error(404, 'Grade not found');
		}

		return json({ message: 'Grade deleted successfully' });
	} catch (err) {
		console.error('Error deleting grade:', err);
		throw error(500, 'Failed to delete grade');
	}
};
