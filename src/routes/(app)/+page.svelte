<script lang="ts">
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import Card from '$components/ui/card/card.svelte';
	import { Plus } from 'lucide-svelte';
	import type { PageData } from './$types';
	import Collection from './collection.svelte';
	import { setTitle } from '$lib/helper';

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
</script>

{#await collectionsPromise}
	<p>Getting collections</p>
{:then { data: collections, error }}
	{#if error}
		<ErrorAlert {error} />
	{/if}

	{#if collections}
		<section
			class="w-full md:w-3/4 xl:w-2/3 h-4/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-5 gap-3"
		>
			{#each collections as collection}
				<a href="/collection/{collection.uid}">
					<Collection {collection} />
				</a>
			{/each}
			{#if session}
				<Card class="card hover-card p-0">
					<a href="/new" class="w-full h-full flex items-center justify-center">
						<Plus size={21} />
					</a>
				</Card>
			{/if}
		</section>
	{:else}
		<p>No collections</p>
	{/if}
{/await}
