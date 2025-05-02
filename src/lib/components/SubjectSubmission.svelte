<script>
	import { addSubject } from '$lib/service/subject_service';
	import { BookOpenText } from '@lucide/svelte';

	let subjects = {
		subject_id: '',
		subject_name: ''
	};

	async function addSubjects() {
		const response = await addSubject(subjects);

		if (!response) {
			alert('Error adding subject');
			return;
		}

		subjects = {
			subject_id: '',
			subject_name: ''
		};

		console.log('Subject added successfully', response);
	}
</script>

<div
	class="w-full flex flex-col justify-start relative z-20 bg-white h-auto max-h-96 border border-gray-500 p-5 rounded-md overflow-y-auto"
>
	<div class="flex items-center gap-2">
		<BookOpenText class="w-5 h-5" />
		<h1 class="text-lg font-bold">Subject Management</h1>
	</div>
	<p class="text-sm text-gray-700 mb-2">Add and manage subject records</p>
	<div class="mb-5">
		<label for="id" class="block mb-2 text-sm font-medium text-gray-900">Subject ID</label>
		<input
			type="text"
			id="id"
			bind:value={subjects.subject_id}
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
			placeholder="CS101"
			required
		/>
	</div>
	<div class="mb-5">
		<label for="name" class="block mb-2 text-sm font-medium text-gray-900">Subject Name</label>
		<input
			type="text"
			id="name"
			bind:value={subjects.subject_name}
			placeholder="Computer Science"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
			required
		/>
	</div>

	<button
		type="submit"
		onclick={addSubjects}
		class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
		>Add Subject</button
	>
</div>
