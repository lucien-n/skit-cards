<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/ui/button/button.svelte';
	import { Edit } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	export let flashcard: TFlashcard;

	const dispatch = createEventDispatcher();

	let showAnswer = false;

	const toggleShowAnswer = () => (showAnswer = !showAnswer);
</script>

{#key showAnswer}
	<article class="relative w-full flex flex-col items-center">
		<button
			in:fade={{ duration: 150 }}
			on:click={toggleShowAnswer}
			class="relative w-full md:w-2/3 xl:w-1/2 h-[350px] card hover-card flex flex-col gap-3"
			class:border-primary={showAnswer}
		>
			<a
				class="absolute right-3 top-3"
				href="/collection/{flashcard.collection}/edit/{flashcard.uid}?callback_url={$page.url.href}"
				on:click|stopPropagation
			>
				<Edit />
			</a>
			<div class="w-full h-full flex items-center justify-center">
				{#if !showAnswer}
					<h1 class="text-xl">{flashcard.question}</h1>
				{:else}
					<h1 class="text-xl">{flashcard.answer}</h1>
				{/if}
			</div>
		</button>
		{#if showAnswer}
			<div class="w-full flex justify-center">
				<Button class="bottom-2 w-3/4 md:w-1/3 absolute" on:click={() => dispatch('next')}
					>Next</Button
				>
			</div>
		{/if}
	</article>
{/key}
