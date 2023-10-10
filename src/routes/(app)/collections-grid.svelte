<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { cfetch, type CFetchPromise, type CFetchResponse } from '$lib/cfetch';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import CollectionSkeleton from './collection-skeleton.svelte';
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import { Card } from '$components/ui/card';
	import { Plus } from 'lucide-svelte';
	import Paginator from '$components/cards/paginator.svelte';
	import type { Session } from '@supabase/supabase-js';
	import Collection from './collection.svelte';

	export let session: Session | null;
	export let which: string;
	export let baseUrl = `${$page.url.origin}/api/collections`;

	let collectionPerPage: number = 11;
	const currentPage = writable<number>(0);
	let getCollections: CFetchPromise<TCollection[]> = new Promise((resolve) =>
		resolve({} as CFetchResponse<TCollection[]>)
	);

	onMount(() => {
		const current: number = parseInt($page.url.searchParams.get('p') || '0');
		currentPage.set(current);

		currentPage.subscribe((current) => (getCollections = filterCollections(current)));
	});

	const filterCollections = async (current: number) => {
		if (!browser) return {} as CFetchResponse<TCollection[] | null>;

		const url = new URL(baseUrl);
		url.searchParams.set('limit', collectionPerPage.toString());
		url.searchParams.set('offset', (current * collectionPerPage).toString());
		url.searchParams.set('which', which);

		return cfetch<TCollection[]>(url.href, 'GET', fetch);
	};
	const showCreateButton = (collections?: TCollection[] | null) => {
		if (!collections) return false;
		return collections.length <= collectionPerPage;
	};
</script>

<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 h-fit w-full">
	{#await getCollections}
		{#each { length: 3 } as _}
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
