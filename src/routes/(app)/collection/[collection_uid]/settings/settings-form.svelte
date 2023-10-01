<script lang="ts">
	import { collectionSchema, type CollectionSchema } from '$lib/schemas/collection_schema';
	import type { SubmitFunction } from 'formsnap';
	import { createEventDispatcher } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$components/ui/form';
	import { enhance } from '$app/forms';
	import { Button } from '$components/ui/button';
	import { Trash, Trash2 } from 'lucide-svelte';

	export let form: SuperValidated<CollectionSchema>;

	const dispatch = createEventDispatcher();

	let loading: boolean = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			loading = false;
			dispatch(result.type, result);
		};
	};

	const cancel = () => dispatch('cancel');
</script>

<Form.Root {form} schema={collectionSchema} let:config>
	<form method="POST" use:enhance={handleSubmit} class="flex flex-col gap-2">
		<Form.Field {config} name="name">
			<Form.Item>
				<Form.Label>Name</Form.Label>
				<Form.Input
					type="text"
					placeholder="Capitals of Europe"
					minlength={3}
					maxlength={255}
					required
				/>
				<Form.Description />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="isPublic">
			<Form.Item class="flex flex-col">
				<Form.Label>Public</Form.Label>
				<Form.Switch required />
				<Form.Description />
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<div class="flex w-full gap-3">
			<Form.Button formaction="?/delete" variant="destructive">
				<Trash2 />
			</Form.Button>
			<Form.Button formaction="?/update" disabled={loading} class="pt-2 w-full"
				>{loading ? 'Saving' : 'Save'}</Form.Button
			>
			<Button type="button" on:click={cancel}>Cancel</Button>
		</div>
	</form>
</Form.Root>
