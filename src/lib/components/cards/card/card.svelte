<script lang="ts">
	import * as Card from '$components/ui/card';

	export let card: TFlashcard;

	let showAnswer: boolean = true;
</script>

<Card.Root>
	<Card.Content>
		{#if !showAnswer}
			{card.question}
		{:else}
			{card.answer}
		{/if}
	</Card.Content>
</Card.Root>
