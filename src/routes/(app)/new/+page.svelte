<script lang="ts">
	import { Card } from '$components/ui/card';
	import { setTitle } from '$lib/helper';
	import type { PageServerData } from './$types';
	import CreateCollectionForm from './create-collection-form.svelte';

	export let data: PageServerData;

	setTitle('New Collection');
</script>

<Card class="card">
	<CreateCollectionForm form={data.form} />
</Card>
