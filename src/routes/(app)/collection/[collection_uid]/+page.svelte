<script lang="ts">
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import type { PageData } from './$types';
	import CardCarrousel from './card-carrousel.svelte';

	export let data: PageData;

	const {
		streamed: { collectionPromise, cardsPromise }
	} = data;
</script>

<section class="w-full h-full flex items-center justify-center flex-col relative">
	{#await collectionPromise}
		<p>Fetching collection</p>
	{:then { data: collection, error }}
		{#if error}
			<ErrorAlert {error} />
		{:else if collection}
			<h1 class="text-center text-4xl font-semibold absolute top-20">
				{collection.name}
			</h1>
			{#await cardsPromise}
				<p>Fetching collection cards</p>
			{:then { data: cards, error }}
				{#if error}
					<ErrorAlert {error} />
				{:else if cards}
					<CardCarrousel {cards} />
				{:else}
					<p>
						No cards in collection. <a
							href="/collection/{collection.uid}/edit/new"
							class="font-semibold hover:underline">Start editing</a
						>
					</p>
				{/if}
			{/await}
		{:else}
			<p>Collection not found</p>
		{/if}
	{/await}
</section>
