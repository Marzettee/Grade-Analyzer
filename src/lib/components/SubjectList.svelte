<script lang="ts">
	import { deleteSubject, editSubject, getSubjectList } from '$lib/service/subject_service';
	import { BookOpenText } from '@lucide/svelte';
	import { Trash, UserRound, Pencil, RotateCcw } from '@lucide/svelte';

	import { onMount } from 'svelte';

	export let subjects: { id: number; subject_id: string; subject_name: string }[] = [];
	export let refreshSubjects: () => Promise<void>;

	let update_subject = {
		subject_id: '',
		subject_name: ''
	};
	let selectedSubjectId: number | null = null;
	let showModal = false;
	let deleteModal = false;

	async function handleEdit() {
		if (selectedSubjectId !== null) {
			const response = await editSubject(selectedSubjectId, update_subject);

			if (response.status === 200) {
				console.log('Subject updated successfully', response);

				const updatedSubjects = await getSubjectList();
				subjects = updatedSubjects;
				closeModal();
			} else {
				console.error('Failed to update subject');
			}
		}
	}

	async function handleDelete() {
		if (selectedSubjectId !== null) {
			const response = await deleteSubject(selectedSubjectId);

			if (response.status === 200) {
				const res = await getSubjectList();
				subjects = res;
				closeDeleteModal();
			} else {
				console.error('Failed to update subject');
			}
		}
	}

	function openDeleteModal(subject: { id: number }) {
		selectedSubjectId = subject.id;

		deleteModal = true;
	}

	function closeDeleteModal() {
		deleteModal = false;
		selectedSubjectId = null;
	}

	// update
	function openModal(subject: { id: number; subject_id: string; subject_name: string }) {
		selectedSubjectId = subject.id;

		update_subject.subject_id = subject.subject_id;
		update_subject.subject_name = subject.subject_name;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedSubjectId = null;
		update_subject = { subject_id: '', subject_name: '' };
	}

	onMount(async () => {
		await refreshSubjects();
	});
</script>

<div
	class="w-full flex flex-col justify-start relative z-20 bg-white h-auto max-h-96 border border-gray-500 p-5 rounded-md overflow-y-auto"
>
	<div class="flex items-center gap-2 w-full justify-between">
		<div class="flex items-center gap-2">
			<BookOpenText class="w-5 h-5" />
			<h1 class="text-lg font-bold">Subject List</h1>
		</div>
		<button class="cursor-pointer" onclick={refreshSubjects}>
			<RotateCcw />
		</button>
	</div>
	<p class="text-sm text-gray-700 mb-2">Add and manage subject records</p>

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
				{#each subjects as subject}
					<tr class="bg-white border-b border-gray-200">
						<th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap">
							{subject.subject_id}
						</th>
						<td class="px-6 py-4 text-black"> {subject.subject_name} </td>
						<td class="px-6 py-4 flex gap-5">
							<button
								class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
								onclick={() => openModal(subject)}
							>
								<Pencil class="w-5 h-5 text-green-500" />
							</button>
							<button
								class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
								onclick={() => openDeleteModal(subject)}
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
	<div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
		<div class="bg-white p-6 rounded-md shadow-md w-96">
			<h2 class="text-lg font-bold mb-4">Edit Subject</h2>
			<div class="mb-4">
				<label for="subject_id" class="block text-sm font-medium text-gray-700">Subject ID</label>
				<input
					id="subject_id"
					type="text"
					bind:value={update_subject.subject_id}
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
					bind:value={update_subject.subject_name}
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
			<h2 class="text-lg font-bold mb-4">Edit Subject</h2>
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
