<script lang="ts">
	import { page } from '$app/stores';
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import { setTitle } from '$lib/helper';
	import { Plus, Settings } from 'lucide-svelte';
	import type { PageData } from './$types';
	import CardCarrousel from './card-carrousel.svelte';
	import Button from '$components/ui/button/button.svelte';

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

	const getSettingsUrl = (collection: TCollection) => {
		const settingsUrl = new URL(`${$page.url.origin}/collection/${collection.uid}/settings`);

		settingsUrl.searchParams.set('is_public', '' + collection.is_public);
		settingsUrl.searchParams.set('name', collection.name);

		return settingsUrl.href;
	};
</script>

<section class="w-full h-full flex items-center justify-center flex-col relative gap-3">
	{#await collectionPromise}
		<p>Fetching collection</p>
	{:then { data: collection, error }}
		{#if error}
			<ErrorAlert {error} />
		{:else if collection}
			<div class="flex flex-col w-full justify-center items-center gap-4 top-20 absolute">
				<h1 class="text-center text-4xl font-semibold">
					{collection.name}
				</h1>
				<div class="flex gap-4">
					{#if profile && profile.name === collection.author}
						<Button variant="ghost" href={getSettingsUrl(collection)}>
							<Settings />
						</Button>
						<Button
							href={getAddUrl(collection.uid)}
							class="rounded-md text-lg px-5 py-2 bg-primary text-background flex items-center gap-1"
						>
							<Plus />
							Add</Button
						>
					{/if}
				</div>
			</div>
			{#await cardsPromise}
				<p>Fetching collection cards</p>
			{:then { data: cards, error }}
				{#if error}
					<ErrorAlert {error} />
				{:else if cards && cards.length > 0}
					<CardCarrousel {cards} {profile} author={collection.author} />
				{:else}
					<p>
						No cards in collection. <a
							href={getAddUrl(collection.uid)}
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
