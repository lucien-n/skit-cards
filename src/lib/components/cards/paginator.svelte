<script lang="ts">
	import { cn } from '$utils';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let current: number;
	export let size: number;
	export let showArrows: boolean = false;
	export let controllable: boolean = true;

	const dispatch = createEventDispatcher();

	const change = (index: number) => {
		if (!controllable) return;
		current = index;
		dispatch('change', index);
	};

	const next = () => {
		if (current + 1 < size) current += 1;
	};

	const previous = () => {
		if (current - 1 >= 0) current -= 1;
	};
</script>

<div class="w-fit relative flex items-center justify-center">
	<button
		class="absolute left-0 -translate-x-8"
		class:hidden={!showArrows || current == 0}
		on:click={previous}
	>
		<ChevronLeft />
	</button>
	<div class="w-fit flex gap-2 items-center">
		{#each { length: size } as _, i}
			<button
				class={cn(
					'w-3 h-3 rounded-full ease-in-out duration-200',
					current === i ? 'bg-primary scale-125' : 'bg-primary/60'
				)}
				class:bg-primary={current == i}
				on:click={() => change(i)}
			/>
		{/each}
	</div>
	<button
		class="absolute right-0 translate-x-8"
		class:hidden={!showArrows || current === size - 1}
		on:click={next}
	>
		<ChevronRight />
	</button>
</div>
