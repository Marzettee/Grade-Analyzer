<script lang="ts">
	import { deleteGrade } from '$lib/service/grade_service';
	import { deleteStudent, editStudent, getStudentList } from '$lib/service/student_service';
	import { Trash, UserRound, Pencil, RotateCcw } from '@lucide/svelte';
	import { onMount } from 'svelte';

	export let students: { id: number; student_id: string; name: string }[] = [];
	export let refreshStudents: () => Promise<void>;

	let update_student = {
		student_id: '',
		name: ''
	};
	let selectedStudentID: number | null = null;
	let showModal = false;
	let deleteModal = false;

	async function handleEdit() {
		if (selectedStudentID !== null) {
			const response = await editStudent(selectedStudentID, update_student);

			if (response.status === 200) {
				console.log('Subject updated successfully', response);

				const updatedSubjects = await getStudentList();
				students = updatedSubjects;
				closeModal();
			} else {
				console.error('Failed to update subject');
			}
		}
	}

	async function handleDelete() {
		if (selectedStudentID !== null) {
			const response = await deleteStudent(selectedStudentID);

			if (response.status === 200) {
				const res = await getStudentList();
				students = res;
				closeDeleteModal();
			} else {
				console.error('Failed to update subject');
			}
		}
	}

	function openDeleteModal(subject: { id: number }) {
		selectedStudentID = subject.id;

		deleteModal = true;
	}

	function closeDeleteModal() {
		deleteModal = false;
		selectedStudentID = null;
	}

	// update
	function openModal(student: { id: number; student_id: string; name: string }) {
		selectedStudentID = student.id;
		update_student.student_id = student.name;
		update_student.student_id = student.student_id;
		update_student.name = student.name;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedStudentID = null;
		update_student = { student_id: '', name: '' };
	}

	onMount(async () => {
		await refreshStudents();
	});
</script>

<div
	class="w-full flex flex-col justify-start bg-white h-auto max-h-96 border border-gray-500 p-5 rounded-md overflow-y-auto"
>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<UserRound class="w-5 h-5" />
			<h1 class="text-lg font-bold">Student List</h1>
		</div>
		<button class="cursor-pointer" onclick={refreshStudents}>
			<RotateCcw />
		</button>
	</div>
	<p class="text-sm text-gray-700 mb-2">List of all the students</p>

	<div class="relative overflow-x-auto w-full">
		<table class="w-full text-sm text-left rtl:text-right text-gray-500">
			<thead class="text-xs text-black uppercase bg-white border-b border-gray-200">
				<tr>
					<th scope="col" class="px-6 py-3"> ID </th>
					<th scope="col" class="px-6 py-3"> Name </th>
					<th scope="col" class="px-6 py-3"> Action </th>
				</tr>
			</thead>
			<tbody>
				{#each students as student}
					<tr class="bg-white border-b border-gray-200">
						<th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap">
							{student.student_id}
						</th>
						<td class="px-6 py-4 text-black"> {student.name} </td>
						<td class="px-6 py-4 flex gap-5">
							<button
								class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
								onclick={() => openModal(student)}
							>
								<Pencil class="w-5 h-5 text-green-500" />
							</button>
							<button
								class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
								onclick={() => openDeleteModal(student)}
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

{#if showModal}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
		<div class="bg-white p-6 rounded-md shadow-md w-96">
			<h2 class="text-lg font-bold mb-4">Edit Student</h2>
			<div class="mb-4">
				<label for="subject_id" class="block text-sm font-medium text-gray-700">Subject ID</label>
				<input
					id="subject_id"
					type="text"
					bind:value={update_student.student_id}
					class="mt-1 block w-full border rounded-md border-gray-500 p-2 focus:border-green-500 focus:ring-green-500 sm:text-sm"
				/>
			</div>
			<div class="mb-4">
				<label for="subject_name" class="block text-sm font-medium text-gray-700"
					>Subject Name</label
				>
				<input
					id="subject_name"
					type="text"
					bind:value={update_student.name}
					class="mt-1 block w-full border rounded-md border-gray-500 p-2 focus:border-green-500 focus:ring-green-500 sm:text-sm"
				/>
			</div>
			<div class="flex justify-end">
				<button class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2" onclick={closeModal}>
					Cancel
				</button>
				<button class="bg-green-600 text-white px-4 py-2 rounded-md" onclick={handleEdit}>
					Save
				</button>
			</div>
		</div>
	</div>
{/if}

{#if deleteModal}
	<div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
		<div class="bg-white p-6 rounded-md shadow-md w-96">
			<h2 class="text-lg font-bold mb-4">Edit Student</h2>
			<p>Are you sure you want to delete this?</p>
			<div class="flex justify-end">
				<button
					class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
					onclick={closeDeleteModal}
				>
					Cancel
				</button>
				<button class="bg-green-600 text-white px-4 py-2 rounded-md" onclick={handleDelete}>
					Delete
				</button>
			</div>
		</div>
	</div>
{/if}
