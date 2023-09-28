<script lang="ts">
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import Button from '$components/ui/button/button.svelte';
	import { setTitle } from '$lib/helper';
	import type { PageData } from './$types';
	import CardCarrousel from './card-carrousel.svelte';

	export let data: PageData;

	const {
		streamed: { collectionPromise, cardsPromise },
		profile
	} = data;

	setTitle('Collection');
</script>

<section class="w-full h-full flex items-center justify-center flex-col relative gap-3">
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
					{#if profile && profile.uid === collection.author}
						<a
							href="/collection/{collection.uid}/edit/new"
							class="rounded-md text-lg px-5 py-2 bg-primary text-background">Add</a
						>
					{/if}
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
