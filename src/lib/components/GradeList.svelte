<script lang="ts">
	import { deleteGrade, editGrade } from '$lib/service/grade_service';
	import { deleteStudent, editStudent, getStudentList } from '$lib/service/student_service';
	import { Trash, UserRound, Pencil, RotateCcw, GraduationCap } from '@lucide/svelte';
	import { onMount } from 'svelte';

	export let grades: { id: number; studentName: string; subjectName: string; grade: number }[] = [];
	export let refreshGrades: () => Promise<void>;

	let update_grade = {
		id: 0,
		studentName: '',
		subjectName: '',
		grade: 0
	};

	let modal = false;
	let selectedGradeID: number | null = null;
	let deleteModal = false;

	async function editGrades() {
		if (selectedGradeID !== null) {
			console.log(selectedGradeID);
			const response = await editGrade(selectedGradeID, update_grade);

			if (response.status === 200) {
				console.log('Subject updated successfully', response);

				const updatedGrades = await getStudentList();
				grades = updatedGrades;
				closeModal();
			} else {
				console.error('Failed to update subject');
			}
		}
	}
	async function deleteGrades() {
		if (selectedGradeID !== null) {
			const response = await deleteGrade(selectedGradeID);

			if (response.status === 200) {
				const res = await getStudentList();
				grades = res;
				closeDeleteModal();
			} else {
				console.error('Failed to update subject');
			}
		}
	}

	function openDeleteModal(grade: { id: number }) {
		selectedGradeID = grade.id;

		deleteModal = true;
	}

	function closeDeleteModal() {
		deleteModal = false;
		selectedGradeID = null;
	}

	function openModal(grade: {
		id: number;
		studentName: string;
		subjectName: string;
		grade: number;
	}) {
		selectedGradeID = grade.id;
		update_grade.studentName = grade.studentName;
		update_grade.subjectName = grade.subjectName;
		update_grade.grade = grade.grade;
		modal = true;
	}

	function closeModal() {
		modal = false;
	}

	onMount(async () => {
		await refreshGrades();
	});
</script>

<div
	class="w-full flex flex-col justify-start bg-white h-full max-h-96 items-stretch border border-gray-500 p-5 rounded-md overflow-y-auto"
>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<GraduationCap class="w-5 h-5" />
			<h1 class="text-lg font-bold">Grade List</h1>
		</div>
		<button class="cursor-pointer" onclick={refreshGrades}>
			<RotateCcw />
		</button>
	</div>
	<p class="text-sm text-gray-700 mb-2">List of all students grades</p>

	<div class="relative overflow-x-auto w-full">
		<table class="w-full text-sm text-left rtl:text-right text-gray-500">
			<thead class="text-xs text-black uppercase bg-white border-b border-gray-200">
				<tr>
					<th scope="col" class="px-6 py-3"> Student Name </th>
					<th scope="col" class="px-6 py-3"> Subject Name </th>
					<th scope="col" class="px-6 py-3"> Grade </th>
					<th scope="col" class="px-6 py-3"> Action </th>
				</tr>
			</thead>
			<tbody>
				{#each grades as grade}
					<tr class="bg-white border-b border-gray-200 w-full">
						<th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap">
							{grade.studentName}
						</th>
						<td class="px-6 py-4 text-black"> {grade.subjectName} </td>

						<td class="px-6 py-4 inline-flex items-center gap-2 text-black">
							{grade.grade}
							{#if grade.grade >= 90}
								<span class="flex w-3 h-3 me-3 bg-green-500 rounded-full"></span>
							{:else if grade.grade >= 80}
								<span class="flex w-3 h-3 me-3 bg-blue-600 rounded-full"></span>
							{:else if grade.grade >= 70}
								<span class="flex w-3 h-3 me-3 bg-yellow-500 rounded-full"></span>
							{:else if grade.grade >= 60}
								<span class="flex w-3 h-3 me-3 bg-orange-500 rounded-full"></span>
							{:else}
								<span class="flex w-3 h-3 me-3 bg-red-500 rounded-full"></span>
							{/if}
						</td>
						<td class="px-6 py-4">
							<button
								onclick={() => openModal(grade)}
								class="font-medium cursor-pointer pr-5 text-blue-600 dark:text-blue-500 hover:underline"
							>
								<Pencil class="w-5 h-5 text-green-500" />
							</button>
							<button
								onclick={() => openDeleteModal(grade)}
								class="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline"
							>
								<Trash class="w-5 h-5 text-red-500" />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

{#if modal === true}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
		<div class=" flex flex-col gap-3 items-center w-fit bg-white p-5 rounded-md">
			<h2 class="text-lg font-bold mb-4">Edit grade</h2>
			<div class="w-full">
				<div>
					<label for="student" class="block mb-2 text-sm font-medium text-gray-900"
						>Student Name</label
					>
					<input
						id="student"
						disabled
						bind:value={update_grade.studentName}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
					/>
				</div>

				<div class="mb-5 w-full">
					<label for="subject" class="block mb-2 text-sm font-medium text-gray-900">Subject</label>
					<input
						id="subject"
						disabled
						bind:value={update_grade.subjectName}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
					/>
				</div>

				<div class="">
					<label for="grade" class="block mb-2 text-sm font-medium text-gray-900"
						>Student Grade</label
					>
					<input
						type="number"
						id="grade"
						min="50"
						max="99"
						bind:value={update_grade.grade}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
						required
					/>
				</div>
			</div>
			<div class="flex justify-end">
				<button class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2" onclick={closeModal}>
					Cancel
				</button>
				<button class="bg-green-600 text-white px-4 py-2 rounded-md" onclick={editGrades}>
					Save
				</button>
			</div>
		</div>
	</div>
{/if}

{#if deleteModal}
	<div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
		<div class="bg-white p-6 rounded-md shadow-md w-96">
			<h2 class="text-lg font-bold mb-4">Delete grade?</h2>
			<p>Are you sure you want to delete this?</p>
			<div class="flex justify-end">
				<button
					class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
					onclick={closeDeleteModal}
				>
					Cancel
				</button>
				<button class="bg-green-600 text-white px-4 py-2 rounded-md" onclick={deleteGrades}>
					Delete
				</button>
			</div>
		</div>
	</div>
{/if}
