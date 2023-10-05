<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/ui/button/button.svelte';
	import { Edit } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import FlashcardBase from './flashcard-base.svelte';

	export let flashcard: TFlashcard;
	export let isAuthor: boolean = false;

	const dispatch = createEventDispatcher();

	let showAnswer = false;

	const url = new URL(
		`${$page.url.origin}/collection/${flashcard.collection}/edit/${flashcard.uid}`
	);
	url.searchParams.set('question', flashcard.question);
	url.searchParams.set('answer', flashcard.answer);

	const toggleShowAnswer = () => (showAnswer = !showAnswer);
</script>

{#key showAnswer}
	<FlashcardBase>
		{#if isAuthor}
			<a class="absolute right-3 top-3" href={url.href} on:click>
				<Edit />
			</a>
		{/if}
		<button
			in:fade={{ duration: 150 }}
			on:click={toggleShowAnswer}
			class="flex flex-col gap-3"
			class:border-primary={showAnswer}
		>
			<div class="w-full h-full flex items-center justify-center text-2xl">
				{#if !showAnswer}
					<h1>{flashcard.question}</h1>
				{:else}
					<h1>{flashcard.answer}</h1>
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
	</FlashcardBase>
{/key}
