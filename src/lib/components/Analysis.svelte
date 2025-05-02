<script lang="ts">
	import { GraduationCap, RefreshCw } from '@lucide/svelte';
	import { marked } from 'marked';

	export let grades: { id: number; studentName: string; subjectName: string; grade: number }[] = [];
	let aiAnalysis = '';
	let isLoading = false;
	let errorMessage = '';

	async function fetchAiAnalysis() {
		isLoading = true;
		errorMessage = '';
		aiAnalysis = '';
		try {
			const response = await fetch('/api/analysis', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					grades,
					model: 'llama-3.3-70b-versatile'
				})
			});

			if (!response.ok) {
				const err = await response.json();
				throw new Error(err.message || 'Failed to get AI analysis');
			}

			const result = await response.json();
			aiAnalysis = result.content;
		} catch (err) {
			console.error('Groq API error:', err);
			errorMessage = 'Failed to load AI analysis';
		} finally {
			isLoading = false;
		}
	}
</script>

<div
	class="w-full min-h-screen flex flex-col gap-5 bg-white border border-gray-500 rounded-md max-w-7xl mx-auto p-5"
>
	<div>
		<div class="flex items-center gap-2">
			<GraduationCap class="w-10 h-10" />
			<h1 class="text-2xl font-bold">AI-powered Grade Analysis</h1>
		</div>
		<p class="text-sm text-gray-500">
			Get insights and recommendations based on students performance
		</p>
	</div>

	<button
		onclick={async () => await fetchAiAnalysis()}
		class="w-fit px-4 py-3 flex gap-2 items-center bg-green-500 hover:bg-green-600 text-white rounded-md self-end"
		><RefreshCw class="w-4 h-4" /> Generate Analysis</button
	>

	{#if aiAnalysis === ''}
		<div class="flex h-full flex-col w-full items-center relative top-56 justify-center">
			<GraduationCap class="w-20 h-20 text-gray-500" />
			<p class="text-lg text-gray-500">No analysis available</p>
			<p class="text-lg text-gray-500">Please generate analysis</p>
		</div>
	{:else}
		<div class="prose p-10 border border-gray-500 rounded-md h-auto">
			{@html marked.parse(aiAnalysis)}
		</div>
	{/if}
</div>

<style>
	:global(.prose) {
		max-width: none;
	}
	:global(.prose h2) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose ul) {
		list-style-type: disc;
		padding-left: 1.5rem;
	}
</style>
