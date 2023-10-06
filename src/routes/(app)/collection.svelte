<script lang="ts">
	import { onMount } from 'svelte';

	export let collection: TCollection;

	let element: HTMLElement;

	onMount(() => {
		element.style.backgroundColor = `${collection.color}09`;
		element.style.borderColor = collection.color;
	});

	console.log(collection.color);
</script>

<article
	bind:this={element}
	class="relative card border-primary hover-card p-3 w-full h-28 lg:h-40 flex flex-col justify-center items-center text-center bg-opacity-10"
>
	<h1 class="text-2xl font-semibold">{collection.name}</h1>
	<p class="text-foreground/70 text-sm tialic absolute bottom-1">
		by <a class="font-semibold hover:underline" href="/profile/{collection.author}"
			>{collection.author}</a
		>
	</p>
</article>
