<script lang="ts">
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import Card from '$components/ui/card/card.svelte';
	import { Plus } from 'lucide-svelte';
	import type { PageData } from './$types';
	import Collection from './collection.svelte';
	import { setTitle } from '$lib/helper';
	import CollectionSkeleton from './collection-skeleton.svelte';
	import { writable } from 'svelte/store';
	import type { CFetchPromise, CFetchResponse } from '$lib/cfetch';

	export let data: PageData;

	let {
		session,
		streamed: { collectionsPromise }
	} = data;
	$: ({
		session,
		streamed: { collectionsPromise }
	} = data);

	setTitle('Home');

	const currentPage = writable<number>(0);

	let getCollections: CFetchPromise<TCollection[]> = new Promise((resolve) =>
		resolve({} as CFetchResponse<TCollection[]>)
	);

	const filterCollections = async (currentPage: number) => {};

	currentPage.subscribe((current) => {
		filterCollections(current);
	});
</script>

<section
	class="w-full md:w-3/4 xl:w-2/3 h-4/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-5 gap-3"
>
	{#await getCollections}
		{#each { length: 9 } as _}
			<CollectionSkeleton />
		{/each}
	{:then { data: collections, error }}
		{#if error}
			<ErrorAlert {error} />
		{/if}

		{#if collections}
			{#each collections as collection}
				<a href="/collection/{collection.uid}">
					<Collection {collection} />
				</a>
			{/each}
		{/if}
		{#if session}
			<Card class="card hover-card p-0">
				<a href="/new" class="w-full h-full flex items-center justify-center">
					<Plus size={21} />
				</a>
			</Card>
		{/if}
	{/await}
</section>
