<script lang="ts">
	import '../../app.postcss';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import titleStore from '$lib/stores/title';
	import MainNav from './main-nav.svelte';
	import { navigating } from '$app/stores';
	import Loading from './loading.svelte';
	import Card from '$components/ui/card/card.svelte';

	export let data;

	let { supabase, session, profile } = data;
	$: ({ supabase, session, profile } = data);

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
<main class="container h-full flex flex-col justify-center items-center gap-y-2 overflow-hidden">
	<slot />
</main>
