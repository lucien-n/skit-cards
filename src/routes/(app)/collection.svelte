<script lang="ts">
	export let collection: TCollection;
</script>

<div
	class="card border-primary hover-card p-3 w-full h-full flex flex-col justify-center items-center text-center"
>
	<h1 class="text-2xl font-semibold">{collection.name}</h1>
	<p class="text-foreground/70 text-sm tialic">
		by <a class="font-semibold hover:underline" href="/profile/{collection.author}"
			>{collection.author}</a
		>
	</p>
</div>
