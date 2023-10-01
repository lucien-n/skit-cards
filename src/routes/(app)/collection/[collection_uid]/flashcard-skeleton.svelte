<script lang="ts">
	import Skeleton from '$components/ui/skeleton/skeleton.svelte';
	import { fade } from 'svelte/transition';
</script>

<article class="relative w-full md:w-2/3 xl:w-1/2 h-[350px] flex flex-col items-center">
	<button in:fade={{ duration: 150 }} class="w-full h-full card hover-card flex flex-col gap-3">
		<div class="w-full h-full flex items-center justify-center flex-col gap-3">
			<Skeleton class="h-9 w-72" />
			<Skeleton class="h-9 w-56" />
		</div>
	</button>
</article>
