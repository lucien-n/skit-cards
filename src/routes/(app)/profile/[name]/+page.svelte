<script lang="ts">
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import * as Card from '$components/ui/card';
	import { setTitle } from '$lib/helper';
	import { Loader2 } from 'lucide-svelte';
	import type { PageServerData } from './$types';
	import Separator from '$components/ui/separator/separator.svelte';

	export let data: PageServerData;

	const {
		streamed: { profilePromise }
	} = data;

	setTitle('Profile');
</script>

<div class="w-full h-full flex justify-center items-center">
	{#await profilePromise}
		<span class="animate-spin">
			<Loader2 />
		</span>
	{:then { data: profile, error }}
		{#if error || !profile}
			<ErrorAlert error={error || 'Profile not found'} title="Not Found" />
		{:else}
			<Card.Root class="w-full">
				<Card.Header class="p-8">
					<div class="grid grid-rows-2 grid-cols-4 w-fit gap-6">
						<picture class="row-span-2 col-span-1">
							<div class="w-24 h-24 aspect-square bg-muted rounded-full" />
						</picture>
						<div class="col-span-3 text-left p-2">
							<h1 class="text-3xl font-bold">{profile.name}</h1>
						</div>
					</div>
				</Card.Header>
				<Separator />
				<Card.Content />
			</Card.Root>
		{/if}
	{:catch}
		<ErrorAlert error="An error occured" title="Internal Error" />
	{/await}
</div>
