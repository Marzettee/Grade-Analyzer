import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { students } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { student_id, name } = body;

		if (!student_id || !name) {
			throw error(400, 'Missing required fields: student_id, name');
		}

		const newStudent = await db
			.insert(students)
			.values({
				student_id,	
				name,
				createdAt: Date.now(),
				updatedAt: Date.now()
			})
			.returning();

		return json(newStudent[0], { status: 201 });
	} catch (err) {
		console.error('Error creating student:', err);
		throw error(500, 'Failed to create student');
	}
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const id = url.searchParams.get('id');

		if (id) {
			const student = await db
				.select()
				.from(students)
				.where(eq(students.id, parseInt(id)))
				.limit(1);

			if (student.length === 0) {
				throw error(404, 'Student not found');
			}
			return json(student[0]);
		}

		const allStudents = await db.select().from(students);
		return json(allStudents);
	} catch (err) {
		console.error('Error fetching students:', err);
		throw error(500, 'Failed to fetch students');
	}
};
