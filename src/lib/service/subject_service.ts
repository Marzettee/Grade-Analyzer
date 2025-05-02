import dataFetch from './../utils';

export const getSubjectList = async () => {
	const response = await dataFetch('/api/subject', 'GET');

	if (!response) {
		return null;
	}

	return response;
};

export const addSubject = async (subject: any) => {
	const response = await dataFetch('/api/subject', 'POST', subject);
	if (!response) {
		return {
			status: 500,
			message: 'Failed to add subject'
		};
	}

	return {
		status: 200,
		message: 'Subject added successfully'
	};
};

export const editSubject = async (id: number, subject: any) => {
	console.log(id);
	const response = await dataFetch(`/api/subject/${id}`, 'PUT', subject);
	if (!response) {
		return {
			status: 500,
			message: 'Failed to edit subject'
		};
	}

	return {
		status: 200,
		message: 'Subject edited successfully'
	};
};

export const deleteSubject = async (id: number) => {
	const response = await dataFetch(`/api/subject/${id}`, 'DELETE');
	if (!response) {
		return {
			status: 500,
			message: 'Failed to delete subject'
		};
	}

	return {
		status: 200,
		message: 'Subject deleted successfully'
	};
};
