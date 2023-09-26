<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import { HomeIcon, LogInIcon, PlusIcon } from 'lucide-svelte';
	import NavLink from './nav-link.svelte';
	import NavUserDropdown from './nav-user-dropdown.svelte';
	import { Separator } from '$components/ui/separator';

	export let session: Session | null;
	export let profile: TProfile | null;
</script>

<div class="border-b p-3 shadow-md sticky">
	<nav
		class="flex items-center w-full lg:w-[80%] xl:w-[70%] 3xl:w-[60%] mx-auto md:space-x-6 text-lg font-medium justify-between"
	>
		<div class="flex items-center">
			<NavLink href="/">
				<svelte:fragment slot="icon">
					<HomeIcon />
				</svelte:fragment>
				<strong class="hidden md:flex"> Home </strong>
			</NavLink>
		</div>
		<div class="flex items-center space-x-1 md:space-x-2">
			{#if session && profile}
				<NavLink href="/new">
					<svelte:fragment slot="icon">
						<PlusIcon />
					</svelte:fragment>
					<span class="hidden md:flex">New</span>
				</NavLink>
				<Separator orientation="vertical" />
				<NavUserDropdown {profile} />
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
