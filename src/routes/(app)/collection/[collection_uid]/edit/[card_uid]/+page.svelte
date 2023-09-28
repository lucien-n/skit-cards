<script lang="ts">
	import { Card } from '$components/ui/card';
	import { setTitle } from '$lib/helper';
	import type { PageServerData } from './$types';
	import CardForm from './card-form.svelte';

	export let data: PageServerData;

	const { form, mode } = data;

	setTitle(`${mode == 'edit' ? 'Edit' : 'New'}`);
</script>

<Card class="card w-full lg:w-2/3 xl:w-1/2">
	<CardForm {form} {mode} />
</Card>
