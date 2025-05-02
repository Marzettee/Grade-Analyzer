import { json } from '@sveltejs/kit';
import dataFetch from './../utils';

export const getStudentList = async () => {
	const response = await dataFetch('/api/student', 'GET');

	if (!response) {
		return null;
	}

	return response;
};

export const addStudent = async (student: any) => {
	const response = await dataFetch('/api/student', 'POST', student);
	if (!response) {
		return {
			status: 500,
			message: 'Failed to add student'
		};
	}

	return {
		status: 200,
		message: 'Student added successfully'
	};
};

export const editStudent = async (id: number, subject: any) => {
	console.log(id);
	const response = await dataFetch(`/api/student/${id}`, 'PUT', subject);
	if (!response) {
		return {
			status: 500,
			message: 'Failed to edit student'
		};
	}

	return {
		status: 200,
		message: 'Student edited successfully'
	};
};

export const deleteStudent = async (id: number) => {
	const response = await dataFetch(`/api/student/${id}`, 'DELETE');
	if (!response) {
		return {
			status: 500,
			message: 'Failed to delete student'
		};
	}

	return {
		status: 200,
		message: 'Student deleted successfully'
	};
};
