<script lang="ts">
	import Analysis from '$lib/components/Analysis.svelte';
	import GradeList from '$lib/components/GradeList.svelte';
	import GradeSubmission from '$lib/components/GradeSubmission.svelte';
	import StudentList from '$lib/components/StudentList.svelte';
	import StudentSubmission from '$lib/components/StudentSubmission.svelte';
	import SubjectList from '$lib/components/SubjectList.svelte';
	import SubjectSubmission from '$lib/components/SubjectSubmission.svelte';
	import { getGradeList } from '$lib/service/grade_service';
	import { getStudentList } from '$lib/service/student_service';
	import { getSubjectList } from '$lib/service/subject_service';
	import { onMount } from 'svelte';

	let students: { id: number; student_id: string; name: string }[] = [];
	let subjects: { id: number; subject_id: string; subject_name: string }[] = [];
	let grades: { id: number; studentName: string; subjectName: string; grade: number }[] = [];
	let activeTab = 'data-management';

	async function refreshStudents() {
		const response = await getStudentList();
		if (response) {
			students = response;
		}
	}

	async function refreshSubjects() {
		const response = await getSubjectList();
		if (response) {
			subjects = response;
		}
	}

	async function refreshGrades() {
		const response = await getGradeList();
		if (response) {
			grades = response;
		}
	}

	function switchTab(tab: string) {
		activeTab = tab;
	}
	onMount(async () => {
		await refreshSubjects();
		await refreshStudents();
		await refreshGrades();
	});
</script>

<section class="w-full min-h-screen flex flex-col gap-5 bg-white max-w-7xl mx-auto p-5">
	<h1 class="text-2xl font-bold">Student Grade Analysis Platform</h1>
	<p class="text-sm -mt-5">
		Input student grades and get AI-powered insights to improve academic performance
	</p>

	<div class="md:flex bg-gray-300 w-fit p-1 rounded-md">
		<ul class="flex space-x-1 text-sm font-medium text-gray-500 dark:text-gray-400">
			<li>
				<button
					class={activeTab === 'data-management'
						? 'inline-flex items-center p-2.5 text-black bg-white rounded-md active w-full'
						: 'inline-flex items-center p-2.5 rounded-md hover:text-gray-900 bg-transparent hover:bg-gray-100 w-full'}
					on:click={() => switchTab('data-management')}
				>
					Data Management
				</button>
			</li>
			<li>
				<button
					class={activeTab === 'ai-analysis'
						? 'inline-flex items-center p-2.5 text-black bg-white rounded-md active w-full'
						: 'inline-flex items-center p-2.5 rounded-md hover:text-gray-900 bg-transparent hover:bg-gray-100 w-full'}
					on:click={() => switchTab('ai-analysis')}
				>
					AI Analysis
				</button>
			</li>
		</ul>
	</div>

	<div
		class="{activeTab === 'data-management'
			? 'block'
			: 'hidden'} w-full min-h-screen flex flex-col gap-5 bg-white"
	>
		<div class="w-full flex items-stretch rounded-lg gap-3.5 min-h-80 h-full">
			<StudentSubmission />
			<SubjectSubmission />
		</div>

		<GradeSubmission {students} {subjects} />
		<div class="w-full flex items-stretch shadow-md rounded-lg gap-3.5 min-h-80 h-full">
			<StudentList {students} {refreshStudents} />
			<SubjectList {subjects} {refreshSubjects} />
		</div>
		<GradeList {grades} {refreshGrades} />
	</div>
	<div
		class="{activeTab === 'ai-analysis'
			? 'block'
			: 'hidden'} w-full min-h-screen flex flex-col gap-5 bg-white"
	>
		<Analysis />
	</div>
</section>
