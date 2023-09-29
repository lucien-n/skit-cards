<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Card } from '$components/ui/card';
	import { setTitle } from '$lib/helper';
	import type { PageServerData } from './$types';
	import CardForm from './card-form.svelte';

	export let data: PageServerData;

	const { form, mode } = data;

	setTitle(`${mode == 'edit' ? 'Edit' : 'New'}`);

	const gotoCollection = () => {
		const pageUrl = $page.url;
		const collection = pageUrl.pathname.split('/')[2];
		const collectionUrl = `${pageUrl.origin}/collection/${collection}`;
		if (browser) goto(collectionUrl);
	};
</script>

<Card class="card w-full lg:w-2/3 xl:w-1/2">
	<CardForm {form} {mode} on:success={gotoCollection} on:cancel={gotoCollection} />
</Card>
