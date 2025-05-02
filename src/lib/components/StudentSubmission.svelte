<script>
	import { addStudent } from '$lib/service/student_service';
	import { UserRound } from '@lucide/svelte';

	let students = {
		student_id: '',
		name: ''
	};

	async function addStudents() {
		const response = await addStudent(students);

		if (!response) {
			alert('Error adding student');
			return;
		}

		students = {
			student_id: '',
			name: ''
		};

		console.log('Student added successfully', response);
	}
</script>

<div
	class="w-full flex flex-col justify-start relative z-20 bg-white h-auto max-h-96 border border-gray-500 p-5 rounded-md overflow-y-auto"
>
	<div class="flex items-center gap-2">
		<UserRound class="w-5 h-5" />
		<h1 class="text-lg font-bold">Student Management</h1>
	</div>
	<p class="text-sm text-gray-700 mb-2">Add and manage students records</p>
	<div class="mb-5">
		<label for="id" class="block mb-2 text-sm font-medium text-gray-900">Student ID</label>
		<input
			type="text"
			id="id"
			bind:value={students.student_id}
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
			placeholder="202210xxx"
			required
		/>
	</div>
	<div class="mb-5">
		<label for="name" class="block mb-2 text-sm font-medium text-gray-900">Student Name</label>
		<input
			type="text"
			id="name"
			bind:value={students.name}
			placeholder="John Doe"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
			required
		/>
	</div>

	<button
		type="submit"
		onclick={addStudents}
		class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
		>Add Student</button
	>
</div>
