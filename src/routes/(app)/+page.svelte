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
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 h-fit w-full">
		<CollectionsGrid {session} baseUrl={`${$page.url.origin}/api/collections?self`} />
	</div>
</section>
