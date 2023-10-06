<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$components/ui/button';
	import { Plus, Settings } from 'lucide-svelte';

	export let collection: TCollection;
	export let profile: TPublicProfile | null;

	const getSettingsUrl = (collection: TCollection) => {
		const settingsUrl = new URL(`${$page.url.origin}/collection/${collection.uid}/settings`);

		settingsUrl.searchParams.set('is_public', '' + collection.is_public);
		settingsUrl.searchParams.set('name', collection.name);
		settingsUrl.searchParams.set('color', collection.color);

		return settingsUrl.href;
	};

	const getAddUrl = (collectionUid: string) => {
		const addUrl = new URL(`${$page.url.origin}/collection/${collectionUid}/edit/new`);
		return addUrl.href;
	};
</script>

<div class="flex flex-col w-full justify-center items-center gap-4 top-20 absolute">
	<h1 class="text-center text-4xl font-semibold">
		{collection.name}
	</h1>
	<div class="flex gap-4">
		{#if profile && profile.name === collection.author}
			<Button variant="ghost" href={getSettingsUrl(collection)}>
				<Settings />
			</Button>
			<Button
				href={getAddUrl(collection.uid)}
				class="rounded-md text-lg px-5 py-2 bg-primary text-background flex items-center gap-1"
			>
				<Plus />
				Add</Button
			>
		{/if}
	</div>
</div>
