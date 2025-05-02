import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { grades, students, subjects } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { studentId, subjectId, grade } = body;

		if (!studentId || !subjectId || grade === undefined) {
			throw error(400, 'Missing required fields: studentId, subjectId, grade');
		}

		if (!Number.isInteger(grade) || grade < 50 || grade > 99) {
			throw error(400, 'Grade must be an integer between 60 and 99');
		}

		const student = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
		const subject = await db.select().from(subjects).where(eq(subjects.id, subjectId)).limit(1);

		if (student.length === 0 || subject.length === 0) {
			throw error(404, 'Student or subject not found');
		}

		const existingGrade = await db
			.select()
			.from(grades)
			.where(and(eq(grades.studentId, studentId), eq(grades.subjectId, subjectId)))
			.limit(1);

		if (existingGrade.length > 0) {
			throw error(409, 'Grade for this student and subject already exists');
		}

		const newGrade = await db
			.insert(grades)
			.values({
				studentId,
				subjectId,
				grade,
				createdAt: Date.now()
			})
			.returning();

		return json(newGrade[0], { status: 201 });
	} catch (err: any) {
		console.error('Error creating grade:', err);
		if (err.status && err.body) {
			throw err;
		}
		throw error(500, 'Failed to create grade');
	}
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const id = url.searchParams.get('id');
		const studentId = url.searchParams.get('studentId');
		const subjectId = url.searchParams.get('subjectId');

		if (id) {
			const grade = await db
				.select({
					id: grades.id,
					grade: grades.grade,
					createdAt: grades.createdAt,
					studentName: students.name,
					subjectName: subjects.subject_name
				})
				.from(grades)
				.leftJoin(students, eq(grades.studentId, students.id))
				.leftJoin(subjects, eq(grades.subjectId, subjects.id))
				.where(eq(grades.id, parseInt(id)))
				.limit(1);

			if (grade.length === 0) {
				throw error(404, 'Grade not found');
			}
			return json(grade[0]);
		}

		if (studentId || subjectId) {
			const conditions = [];
			if (studentId) conditions.push(eq(grades.studentId, parseInt(studentId)));
			if (subjectId) conditions.push(eq(grades.subjectId, parseInt(subjectId)));

			const filteredGrades = await db
				.select({
					id: grades.id,
					grade: grades.grade,
					createdAt: grades.createdAt,
					studentName: students.name,
					subjectName: subjects.subject_name
				})
				.from(grades)
				.leftJoin(students, eq(grades.studentId, students.id))
				.leftJoin(subjects, eq(grades.subjectId, subjects.id))
				.where(and(...conditions));

			return json(filteredGrades);
		}

		const allGrades = await db
			.select({
				id: grades.id,
				grade: grades.grade,
				createdAt: grades.createdAt,
				studentName: students.name,
				subjectName: subjects.subject_name
			})
			.from(grades)
			.leftJoin(students, eq(grades.studentId, students.id))
			.leftJoin(subjects, eq(grades.subjectId, subjects.id));

		return json(allGrades);
	} catch (err) {
		console.error('Error fetching grades:', err);
		throw error(500, 'Failed to fetch grades');
	}
};
