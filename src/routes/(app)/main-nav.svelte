<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import { HomeIcon, LogInIcon } from 'lucide-svelte';
	import NavLink from './nav-link.svelte';
	import NavUserDropdown from './nav-user-dropdown.svelte';
	import { page } from '$app/stores';

	export let session: Session | null;
	export let profile: TPublicProfile | null;

	const profileHrefPattern = /^\/profile\/[A-z]+$/;

	$: console.log(profileHrefPattern.test($page.url.href.replace($page.url.origin, '')));
</script>

<div class="sticky top-4">
	<nav
		class="flex items-center w-full lg:w-[80%] xl:w-[70%] 3xl:w-[60%] p-3 rounded-md shadow-md bg-background border mx-auto md:space-x-6 text-lg font-medium justify-between"
	>
		<div class="flex items-center">
			<NavLink href="/">
				<svelte:fragment slot="icon">
					<HomeIcon />
				</svelte:fragment>
				<strong class="hidden md:flex"> Home </strong>
			</NavLink>
		</div>
		<div class="flex items-center space-x-1 md:space-x-2 text-foreground/60">
			{#if session && profile}
				<div
					class="font-semibold"
					class:text-foreground={profileHrefPattern.test(
						$page.url.href.replace($page.url.origin, '')
					)}
				>
					<NavUserDropdown {profile} />
				</div>
			{:else}
				<NavLink href="/auth">
					<svelte:fragment slot="icon">
						<LogInIcon />
					</svelte:fragment>
					<span class="hidden md:flex"> Sign In </span>
				</NavLink>
			{/if}
		</div>
	</nav>
</div>
