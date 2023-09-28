<script lang="ts">
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import type { PageData } from './$types';
	import Collection from './collection.svelte';

	export let data: PageData;

	let {
		streamed: { collectionsPromise },
		session,
		profile
	} = data;
	$: ({
		streamed: { collectionsPromise },
		session,
		profile
	} = data);
</script>

{#await collectionsPromise}
	<p>Getting collections</p>
{:then { data, error }}
	{#if error}
		<ErrorAlert {error} />
	{/if}

	{#if data}
		<section class="w-full md:w-3/4 xl:w-2/3 h-4/5 grid grid-cols-4 grid-rows-5">
			{#each data as collection}
				<a href="/collection/{collection.uid}">
					<Collection {collection} />
				</a>
			{/each}
		</section>
	{:else}
		<p>No collections</p>
	{/if}
{/await}
