<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Card from '$components/ui/card/card.svelte';
	import type { PageServerData } from './$types';
	import SettingsForm from './settings-form.svelte';

	export let data: PageServerData;

	const { form } = data;

	const gotoCollection = () => {
		const pageUrl = $page.url;
		const collection = pageUrl.pathname.split('/')[2];
		const collectionUrl = `${pageUrl.origin}/collection/${collection}`;
		if (browser) goto(collectionUrl);
	};
</script>

<Card class="card w-full lg:w-2/3 xl:w-1/2">
	<SettingsForm {form} on:success={gotoCollection} on:cancel={gotoCollection} />
</Card>
