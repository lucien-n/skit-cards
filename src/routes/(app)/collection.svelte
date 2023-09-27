<script lang="ts">
	import * as Card from '$components/ui/card';

	export let collection: TCollection;
</script>

<Card.Root class="w-full h-full hover:shadow-md ease-in-out duration-200">
	<Card.Content class="p-0 w-full h-full flex justify-center items-center">
		<h1 class="text-2xl font-semibold">{collection.name}</h1>
	</Card.Content>
</Card.Root>
