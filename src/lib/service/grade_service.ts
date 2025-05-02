import dataFetch from './../utils';

export const getGradeList = async () => {
	const response = await dataFetch('/api/grade', 'GET');

	if (!response) {
		return null;
	}

	return response;
};

export const addGrade = async (grade: { studentId: number; subjectId: number; grade: number }) => {
	const response = await dataFetch('/api/grade', 'POST', grade);

	if (!response) {
		return {
			status: 500,
			message: 'Failed to add grade'
		};
	}

	return {
		status: 200,
		message: 'Grade added successfully'
	};
};

export const editGrade = async (id: number, grade: { grade: number }) => {
	const response = await dataFetch(`/api/grade/${id}`, 'PUT', grade);

	if (!response) {
		return {
			status: 500,
			message: 'Failed to edit grade'
		};
	}

	return {
		status: 200,
		message: 'Grade edited successfully'
	};
};

export const deleteGrade = async (id: number) => {
	const response = await dataFetch(`/api/grade/${id}`, 'DELETE');

	if (!response) {
		return {
			status: 500,
			message: 'Failed to delete grade'
		};
	}

	return {
		status: 200,
		message: 'Grade deleted successfully'
	};
};
