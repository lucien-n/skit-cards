<script lang="ts">
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import { Card } from '$components/ui/card';
	import * as Dialog from '$components/ui/dialog';
	import { Plus } from 'lucide-svelte';
	import type { PageData, PageServerData } from './$types';
	import Collection from './collection.svelte';
	import CreateCollectionForm from './create-collection-form.svelte';

	export let data: PageData & PageServerData;

	let {
		streamed: { collectionsPromise },
		form
	} = data;
	$: ({
		streamed: { collectionsPromise },
		form
	} = data);
</script>

{#await collectionsPromise}
	<p>Getting collections</p>
{:then { data, error }}
	{#if error}
		<ErrorAlert {error} />
	{/if}

	{#if data}
		<section class="w-full md:w-3/4 xl:w-2/3 h-4/5 grid grid-cols-4 grid-rows-5 gap-3">
			{#each data as collection}
				<a href="/collection/{collection.uid}">
					<Collection {collection} />
				</a>
			{/each}
			<Card class="hover-card">
				<Dialog.Root>
					<Dialog.Trigger class="w-full h-full flex items-center justify-center">
						<Plus size="36" />
					</Dialog.Trigger>
					<Dialog.Content>
						<CreateCollectionForm {form} />
					</Dialog.Content>
				</Dialog.Root>
			</Card>
		</section>
	{:else}
		<p>No collections</p>
	{/if}
{/await}
