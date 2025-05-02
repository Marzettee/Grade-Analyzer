import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	email: text('email').notNull(),
	password: text('password').notNull()
});

export const students = sqliteTable('students', {
	id: integer('id').primaryKey(),
	student_id: text('student_id').notNull(),
	name: text('name').notNull(),
	createdAt: integer('created_at').notNull(),
	updatedAt: integer('updated_at').notNull()
});

export const subjects = sqliteTable('subjects', {
	id: integer('id').primaryKey(),
	subject_id: text('subject_id').notNull(),
	subject_name: text('subject_name').notNull()
});

export const grades = sqliteTable('grades', {
	id: integer('id').primaryKey(),
	studentId: integer('student_id')
		.notNull()
		.references(() => students.id, { onDelete: 'cascade' }),
	subjectId: integer('subject_id')
		.notNull()
		.references(() => subjects.id, { onDelete: 'cascade' }),
	grade: integer('grade').notNull(),
	createdAt: integer('created_at').notNull()
});

export const studentsRelations = relations(students, ({ many }) => ({
	grades: many(grades)
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
	grades: many(grades)
}));

export const gradesRelations = relations(grades, ({ one }) => ({
	student: one(students, {
		fields: [grades.studentId],
		references: [students.id]
	}),
	subject: one(subjects, {
		fields: [grades.subjectId],
		references: [subjects.id]
	})
}));
