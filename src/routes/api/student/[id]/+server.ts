import { db } from '$lib/server/db';
import { students } from '$lib/server/db/schema';
import { error } from 'console';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, params }) => {
	try {
		const id = parseInt(params.id);
		const body = await request.json();
		const { student_id, name } = body;

		const updatedStudent = await db
			.update(students)
			.set({
				student_id,
				name
			})
			.where(eq(students.id, id))
			.returning();

		if (updatedStudent.length === 0) {
			throw error(404, 'Student not found');
		}

		return json(updatedStudent[0]);
	} catch (err) {
		console.error('Error updating student:', err);
		throw error(500, 'Failed to update student');
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const id = params.id;

		if (!id) {
			throw error(400, 'Missing required field: id');
		}

		const deletedStudent = await db
			.delete(students)
			.where(eq(students.id, parseInt(id)))
			.returning();

		if (deletedStudent.length === 0) {
			throw error(404, 'Student not found');
		}

		return json({ message: 'Student deleted successfully' });
	} catch (err) {
		console.error('Error deleting student:', err);
		throw error(500, 'Failed to delete student');
	}
};
