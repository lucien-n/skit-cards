<script lang="ts">
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import { setTitle } from '$lib/helper';
	import { Loader2 } from 'lucide-svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const {
		streamed: { profilePromise }
	} = data;

	setTitle('Profile');
</script>

{#await profilePromise}
	<div class="w-full h-full flex justify-center items-center">
		<span class="animate-spin">
			<Loader2 />
		</span>
	</div>
{:then { data: profile, error }}
	{#if error || !profile}
		<ErrorAlert error={error || 'Profile not found'} title="Not Found" />
	{:else}
		<section class="gap-2 grid grid-cols-3">
			{#each Object.entries(profile) as [key, value]}
				<p class="font-semibold text-right">{key}:</p>
				<p class="text-left w-full col-span-2">{value || '🤷‍♂️'}</p>
			{/each}
		</section>
	{/if}
{:catch}
	<ErrorAlert error="An error occured" title="Internal Error" />
{/await}
