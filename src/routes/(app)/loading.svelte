<script lang="ts">
	import { slide } from 'svelte/transition';
</script>

<div
	transition:slide={{ duration: 200 }}
	class="w-full h-2 bg-primary overflow-x-hidden fixed top-0 z-10"
>
	<div id="progress-bar" class="h-full w-full bg-white rounded-full blur-lg" />
</div>

<style>
	#progress-bar {
		animation: progress-animation 2s linear infinite;
	}

	@keyframes progress-animation {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>