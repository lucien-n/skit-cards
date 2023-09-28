<script lang="ts">
	import { Card } from '$components/ui/card';
	import type { PageServerData } from './$types';
	import CreateCollectionForm from './create-collection-form.svelte';

	export let data: PageServerData;
</script>

<Card class="card">
	<CreateCollectionForm form={data.form} />
</Card>
