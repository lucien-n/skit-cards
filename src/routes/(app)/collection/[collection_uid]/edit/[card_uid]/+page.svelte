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

	const gotoCallbackUrl = () => {
		const callbackUrl = $page.url.searchParams.get('callback_url');
		if (callbackUrl && browser) goto(callbackUrl);
	};
</script>

<Card class="card w-full lg:w-2/3 xl:w-1/2">
	<CardForm {form} {mode} on:success={gotoCallbackUrl} on:cancel={gotoCallbackUrl} />
</Card>
