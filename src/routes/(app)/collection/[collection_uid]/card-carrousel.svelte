<script lang="ts">
	import Paginator from '$components/cards/paginator.svelte';
	import Flashcard from './flashcard.svelte';

	export let cards: TFlashcard[];

	let currentIndex = 0;
	let carrouselEnd: boolean = false;

	const nextCard = () => {
		if (currentIndex + 1 <= cards.length) currentIndex += 1;
		else carrouselEnd = true;
	};

	const getCurrentCard = () => cards[currentIndex];
</script>

<section class="flex flex-col w-full h-fit items-center gap-3">
	<Flashcard flashcard={getCurrentCard()} on:next={nextCard} />
	<Paginator
		bind:current={currentIndex}
		size={cards.length}
		on:change={({ detail }) => (currentIndex = detail)}
	/>
</section>
