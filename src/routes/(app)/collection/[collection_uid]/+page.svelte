<script lang="ts">
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const {
		streamed: { collectionPromise, cardsPromise }
	} = data;
</script>

<section>
	{#await collectionPromise}
		<p>Fetching collection</p>
	{:then { data: collection, error }}
		{#if error}
			<ErrorAlert {error} />
		{:else if collection}
			<h1 class="text-center text-lg">
				{collection.name}
			</h1>
			{#await cardsPromise}
				<p>Fetching collection cards</p>
			{:then { data: cards, error }}
				{#if error}
					<ErrorAlert {error} />
				{:else if cards}
					{#each cards as card}
						<div class="grid grid-cols-3 gap-1">
							{#each Object.entries(card) as [k, v]}
								<p class="text-right font-semibold">{k}:</p>
								<p class="col-span-2">{v}</p>
							{/each}
						</div>
					{/each}
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
