<script lang="ts">
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import Card from '$components/ui/card/card.svelte';
	import { cfetch, type CFetchPromise, type CFetchResponse } from '$lib/cfetch';
	import { setTitle } from '$lib/helper';
	import { Plus } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import CollectionSkeleton from './collection-skeleton.svelte';
	import Collection from './collection.svelte';
	import Paginator from '$components/cards/paginator.svelte';
	import { browser } from '$app/environment';

	export let data: PageData;

	let { session } = data;
	$: ({ session } = data);

	setTitle('Home');

	let collectionPerPage: 8 | 16 | 24 = 8;
	const currentPage = writable<number>(0);

	let getCollections: CFetchPromise<TCollection[]> = new Promise((resolve) =>
		resolve({} as CFetchResponse<TCollection[]>)
	);

	const filterCollections = async (current: number) => {
		if (!browser) return {} as CFetchResponse<TCollection[] | null>;
		return cfetch<TCollection[]>(
			`/api/collections?offset=${current * collectionPerPage}`,
			'GET',
			fetch
		);
	};

	currentPage.subscribe((current) => (getCollections = filterCollections(current)));
</script>

<section class="w-full md:w-3/4 xl:w-2/3 h-4/5">
	<div class="h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-5 gap-3">
		{#await getCollections}
			{#each { length: collectionPerPage } as _}
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
				<Card class="card hover-card p-0 h-full">
					<a href="/new" class="w-full h-full flex items-center justify-center">
						<Plus size={21} />
					</a>
				</Card>
			{/if}
		{/await}
	</div>
	<div class="w-fit mx-auto">
		<Paginator
			current={$currentPage}
			size={3}
			on:change={({ detail }) => currentPage.set(detail)}
			showArrows
		/>
	</div>
</section>
