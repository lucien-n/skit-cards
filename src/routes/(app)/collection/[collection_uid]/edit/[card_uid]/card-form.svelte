<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { cardSchema, type CardSchema } from '$lib/schemas/card_schema';
	import type { SubmitFunction } from 'formsnap';
	import { createEventDispatcher } from 'svelte';
	import * as Form from '$components/ui/form';
	import { enhance } from '$app/forms';
	import Button from '$components/ui/button/button.svelte';
	import ErrorAlert from '$components/cards/error-alert.svelte';
	import { Trash2 } from 'lucide-svelte';

	export let form: SuperValidated<CardSchema>;
	export let mode: string = 'new';

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

	const cancel = () => dispatch('cancel');
</script>

<ErrorAlert {error} />

<Form.Root {form} schema={cardSchema} let:config>
	<form method="POST" use:enhance={handleSubmit} class="flex flex-col gap-2">
		<Form.Field {config} name="question">
			<Form.Item>
				<Form.Label>Question</Form.Label>
				<Form.Textarea
					class="resize-none"
					placeholder="What's the capital of France?"
					minlength={3}
					maxlength={255}
					required
				/>
				<Form.Description />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="answer">
			<Form.Item>
				<Form.Label>Answer</Form.Label>
				<Form.Textarea
					class="resize-none"
					placeholder="Paris"
					minlength={3}
					maxlength={255}
					required
				/>
				<Form.Description />
				<Form.Validation />
			</Form.Item>
		</Form.Field>

		<div class="flex w-full gap-3">
			<Form.Button formaction="?/delete" variant="destructive">
				<Trash2 />
			</Form.Button>
			<Form.Button formaction="?/edit-create" disabled={loading} class="pt-2 w-full"
				>{mode === 'edit'
					? loading
						? 'Saving'
						: 'Save'
					: loading
					? 'Creating'
					: 'Create'}</Form.Button
			>
			<Button type="button" on:click={cancel}>Cancel</Button>
		</div>
	</form>
</Form.Root>
