<script lang="ts">
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import Card from '$components/ui/card/card.svelte';
	import { Plus } from 'lucide-svelte';
	import type { PageData, PageServerData } from './$types';
	import Collection from './collection.svelte';

	export let data: PageData & PageServerData;

	let {
		streamed: { collectionsPromise }
	} = data;
	$: ({
		streamed: { collectionsPromise }
	} = data);
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
			<Card class="card hover-card p-0">
				<a href="/new" class="w-full h-full flex items-center justify-center">
					<Plus size={36} />
				</a>
			</Card>
		</section>
	{:else}
		<p>No collections</p>
	{/if}
{/await}
