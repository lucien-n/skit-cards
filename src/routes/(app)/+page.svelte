<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import Paginator from '$components/cards/paginator.svelte';
	import Card from '$components/ui/card/card.svelte';
	import { cfetch, type CFetchPromise, type CFetchResponse } from '$lib/cfetch';
	import { setTitle } from '$lib/helper';
	import { Plus } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import CollectionSkeleton from './collection-skeleton.svelte';
	import Collection from './collection.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;

	let { session } = data;
	$: ({ session } = data);

	setTitle('Home');

	let collectionPerPage: number = 11;
	const currentPage = writable<number>(0);

	onMount(() => {
		const current: number = parseInt($page.url.searchParams.get('p') || '0');
		currentPage.set(current);
	});

	let getCollections: CFetchPromise<TCollection[]> = new Promise((resolve) =>
		resolve({} as CFetchResponse<TCollection[]>)
	);

	const filterCollections = async (current: number) => {
		if (!browser) return {} as CFetchResponse<TCollection[] | null>;

		const url = new URL(`${$page.url.origin}/api/collections`);
		url.searchParams.set('limit', collectionPerPage.toString());
		url.searchParams.set('offset', (current * collectionPerPage).toString());

		return cfetch<TCollection[]>(url.href, 'GET', fetch);
	};

	currentPage.subscribe((current) => (getCollections = filterCollections(current)));

	const showCreateButton = (collections?: TCollection[] | null) => {
		if (!collections) return false;
		return collections.length <= collectionPerPage;
	};
</script>

<section class="w-full md:w-3/4 xl:w-2/3 h-full flex items-center overflow-y-auto">
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 h-fit w-full">
		{#await getCollections}
			{#each { length: collectionPerPage + 1 } as _}
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
			{#if session && showCreateButton(collections)}
				<Card class="card hover-card p-0 h-28 lg:h-40">
					<a href="/new" class="w-full h-full flex items-center justify-center">
						<Plus size={21} />
					</a>
				</Card>
			{/if}
		{/await}
		<div class="col-span-full mx-auto row-start-auto">
			<Paginator
				current={$currentPage}
				size={3}
				on:change={({ detail }) => currentPage.set(detail)}
				showArrows
			/>
		</div>
	</div>
</section>
