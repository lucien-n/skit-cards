<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/stores';
	import titleStore from '$lib/stores/title';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import '../../app.postcss';
	import Loading from './loading.svelte';
	import MainNav from './main-nav.svelte';

	export let data;

	let { supabase, session, profile, url } = data;
	$: ({ supabase, session, profile, url } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>{$titleStore}</title>
</svelte:head>

{#if $navigating}
	<Loading />
{/if}

<MainNav {session} {profile} />
{#key url}
	<main
		class="container h-full flex flex-col justify-center items-center gap-y-2 overflow-hidden"
		transition:fade={{ duration: 200 }}
	>
		<slot />
	</main>
{/key}
