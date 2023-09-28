<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Card } from '$components/ui/card';
	import { setTitle } from '$lib/helper';
	import type { PageServerData } from './$types';
	import CreateCollectionForm from './create-collection-form.svelte';

	export let data: PageServerData;

	setTitle('New Collection');

	const gotoCollection = (event: CustomEvent) => {
		const {
			detail: { status, data }
		} = event;

		if (status !== 200 || !data.uid) return;
		goto(`${$page.url.origin}/collection/${data.uid}`);
	};
</script>

<Card class="card">
	<CreateCollectionForm form={data.form} on:success={gotoCollection} />
</Card>
