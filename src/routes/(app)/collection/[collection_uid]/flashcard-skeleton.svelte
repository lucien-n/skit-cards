<script lang="ts">
	import Skeleton from '$components/ui/skeleton/skeleton.svelte';
	import { fade } from 'svelte/transition';
	import FlashcardBase from './flashcard-base.svelte';
</script>

<FlashcardBase>
	<button in:fade={{ duration: 150 }} class="flex flex-col gap-3">
		<div class="w-full h-full flex items-center justify-center flex-col gap-3">
			<Skeleton class="h-9 w-72" />
			<Skeleton class="h-9 w-56" />
		</div>
	</button>
</FlashcardBase>
