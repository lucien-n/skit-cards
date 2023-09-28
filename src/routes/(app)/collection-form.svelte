<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Form from '$components/ui/form';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createEventDispatcher } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { collectionSchema, type CollectionSchema } from './collection_schema';

	export let form: SuperValidated<CollectionSchema>;

	const dispatch = createEventDispatcher();

	let loading: boolean = false;
	let created: boolean = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			loading = false;
			dispatch(result.type, result);
		};
	};
</script>

<Form.Root schema={collectionSchema} {form} let:config>
	<form method="POST" use:enhance={handleSubmit} class="flex flex-col gap-2">
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
			<Form.Item>
				<Form.Label>Public</Form.Label>
				<Form.Switch required />
				<Form.Description />
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<Form.Button disabled={loading} class="pt-2">{loading ? 'Creating' : 'Create'}</Form.Button>
	</form>
</Form.Root>
