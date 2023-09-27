<script lang="ts">
	import * as Alert from '$components/ui/alert';

	export let title: string = 'Error';
	export let error: string;
</script>

{#if error}
	<Alert.Root>
		<Alert.Title class="font-semibold">{title}</Alert.Title>
		<Alert.Description>{error}</Alert.Description>
	</Alert.Root>
{/if}
