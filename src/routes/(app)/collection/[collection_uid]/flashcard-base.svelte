<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let highlighted: boolean = false;

	const dispatch = createEventDispatcher();
</script>

<article
	class="relative w-full md:w-2/3 xl:w-1/2 h-[350px] card hover-card p-0"
	class:border-foreground={highlighted}
>
	<slot name="header" />
	<button
		class="w-full h-full flex flex-col items-center justify-center gap-3 p-3"
		on:click={() => dispatch('click')}
	>
		<slot />
	</button>
</article>
