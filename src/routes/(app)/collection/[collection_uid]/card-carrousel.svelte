<script lang="ts">
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

<Flashcard flashcard={getCurrentCard()} on:next={nextCard} />
