<script lang="ts">
	import { page } from '$app/stores';
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import { setTitle } from '$lib/helper';
	import type { PageData } from './$types';
	import CardCarrousel from './card-carrousel.svelte';
	import CollectionHeader from './collection-header.svelte';
	import CardSkeleton from './flashcard-skeleton.svelte';

	export let data: PageData;

	const {
		profile,
		streamed: { collectionPromise, cardsPromise }
	} = data;

	setTitle('Collection');

	const getAddUrl = (collectionUid: string) => {
		const addUrl = new URL(`${$page.url.origin}/collection/${collectionUid}/edit/new`);
		return addUrl.href;
	};
</script>

<section class="w-full h-full flex items-center justify-center flex-col relative gap-3">
	{#await collectionPromise}
		<p>Fetching collection</p>
	{:then { data: collection, error }}
		{#if error}
			<ErrorAlert {error} />
		{:else if collection}
			<CollectionHeader {collection} {profile} />
			{#await cardsPromise}
				<CardSkeleton />
			{:then { data: cards, error }}
				{#if error}
					<ErrorAlert {error} />
				{:else if cards && cards.length > 0}
					<CardCarrousel {cards} {profile} author={collection.author} />
				{:else}
					<p>No cards in collection.</p>
				{/if}
			{/await}
		{:else}
			<p>Collection not found</p>
		{/if}
	{/await}
</section>
