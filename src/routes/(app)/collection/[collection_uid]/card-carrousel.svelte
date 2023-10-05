<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Paginator from '$components/cards/paginator.svelte';
	import Flashcard from './flashcard.svelte';

	export let author: string;
	export let cards: TFlashcard[];
	export let profile: TPublicProfile | null;

	const paramIndex = browser ? parseInt($page.url.searchParams.get('c') || '0') : 0;
	let currentIndex = paramIndex < cards.length ? paramIndex : cards.length - 1;

	$: if (browser) {
		$page.url.searchParams.set('c', currentIndex.toString());
		goto($page.url.href, { replaceState: true }) ?? currentIndex;
	}

	const nextCard = () => {
		if (currentIndex + 1 < cards.length) currentIndex += 1;
	};

	const getCurrentCard = () => cards[currentIndex];
</script>

<section class="flex flex-col w-full h-fit items-center gap-3">
	{#key currentIndex}
		<Flashcard
			flashcard={getCurrentCard()}
			on:next={nextCard}
			isAuthor={!!profile && profile.name === author}
		/>
	{/key}
	<Paginator
		bind:current={currentIndex}
		showArrows
		size={cards.length}
		on:change={({ detail }) => (currentIndex = detail)}
	/>
</section>
