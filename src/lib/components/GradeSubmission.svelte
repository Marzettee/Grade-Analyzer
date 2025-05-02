<script lang="ts">
	import { addGrade } from '$lib/service/grade_service';
	import { GraduationCap } from '@lucide/svelte';
	export let subjects: { id: number; subject_id: string; subject_name: string }[] = [];
	export let students: { id: number; student_id: string; name: string }[] = [];
	// export let loadStudents: () => Promise<void>;
	// export let loadSubjects: () => Promise<void>;

	let grade_submission = {
		studentId: 0,
		subjectId: 0,
		grade: 80
	};

	async function addGrades() {
		const response = await addGrade(grade_submission);
		if (response.status === 201) {
			alert('Grade added successfully');
		}

		if (response.status === 409) {
			alert('Failed to add grade');
		}

		grade_submission = {
			studentId: 0,
			subjectId: 0,
			grade: 80
		};
	}
</script>

<div
	class="w-full flex flex-col justify-start relative z-20 bg-white h-auto max-h-96 border border-gray-500 p-5 rounded-md overflow-y-auto"
>
	<div class="flex items-center gap-2">
		<GraduationCap class="w-5 h-5" />
		<h1 class="text-lg font-bold">Grade Management</h1>
	</div>
	<p class="text-sm text-gray-700 mb-2">Add and manage students records</p>
	<div class="w-full grid grid-cols-3 gap-3 items-center">
		<div class="mb-5 w-full">
			<label for="student" class="block mb-2 text-sm font-medium text-gray-900"
				>Select a student</label
			>
			<select
				id="student"
				bind:value={grade_submission.studentId}
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
			>
				<option value="" disabled selected>Select a student</option>
				{#each students as student}
					<option value={student.id}>{student.name}</option>
				{/each}
			</select>
		</div>

		<div class="mb-5 w-full">
			<label for="subject" class="block mb-2 text-sm font-medium text-gray-900"
				>Select a subject</label
			>
			<select
				id="subject"
				bind:value={grade_submission.subjectId}
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
			>
				<option value="" disabled selected>Select a subject</option>
				{#each subjects as subject}
					<option value={subject.id}>{subject.subject_name}</option>
				{/each}
			</select>
		</div>

		<div class="mb-5">
			<label for="grade" class="block mb-2 text-sm font-medium text-gray-900">Student Grade</label>
			<input
				type="number"
				id="grade"
				min="50"
				max="99"
				bind:value={grade_submission.grade}
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
				required
			/>
		</div>
	</div>

	<button
		type="submit"
		onclick={addGrades}
		class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
		>Add Grade</button
	>
</div>
