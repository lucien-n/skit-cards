<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Form from '$components/ui/form';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createEventDispatcher } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { collectionSchema, type CollectionSchema } from './collection_schema';
	import ErrorAlert from '$components/cards/error-alert.svelte';

	export let form: SuperValidated<CollectionSchema>;

	const dispatch = createEventDispatcher();

	let loading: boolean = false;
	let error: string = '';

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			loading = false;
			if (result.type === 'failure') error = result.data?.error;
			dispatch(result.type, result);
		};
	};
</script>

<ErrorAlert {error} />

<Form.Root {form} schema={collectionSchema} let:config>
	<form
		method="POST"
		action="?/create-collection"
		use:enhance={handleSubmit}
		class="flex flex-col gap-2"
	>
		<Form.Field {config} name="name">
			<Form.Item>
				<Form.Label>Name</Form.Label>
				<Form.Input
					type="text"
					placeholder="Europ Capitals"
					minlength={3}
					maxlength={80}
					required
				/>
				<Form.Description />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="is_public">
			<Form.Item class="flex flex-col">
				<Form.Label>Public</Form.Label>
				<Form.Switch required checked={true} />
				<Form.Description
					>If public, others will only be able to <strong>view</strong> this collection</Form.Description
				>
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Button disabled={loading} class="pt-2">{loading ? 'Creating' : 'Create'}</Form.Button>
	</form>
</Form.Root>
