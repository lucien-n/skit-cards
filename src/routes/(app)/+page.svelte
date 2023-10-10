<script lang="ts">
	import { page } from '$app/stores';
	import { setTitle } from '$lib/helper';
	import type { PageData } from './$types';
	import CollectionsGrid from './collections-grid.svelte';

	export let data: PageData;

	let { session } = data;
	$: ({ session } = data);

	setTitle('Home');
</script>

<section class="w-full md:w-3/4 xl:w-2/3 h-full flex items-center overflow-y-auto">
	<div class="flex flex-col gap-8 w-full h-full justify-center">
		<div>
			{#if session}
				<h1 class="text-xl"><strong>Yours</strong></h1>
				<CollectionsGrid {session} baseUrl={`${$page.url.origin}/api/collections?self`} />
			{/if}
		</div>
		<div>
			<h1 class="text-xl"><strong>Latest</strong></h1>

			<CollectionsGrid {session} baseUrl={`${$page.url.origin}/api/collections?latest`} />
		</div>
	</div>
</section>
