<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$components/ui/button';
	import * as Form from '$components/ui/form';
	import * as Select from '$components/ui/select';
	import { COLLECTION_COLORS, type CollectionColor } from '$lib/constants';
	import { collectionSchema, type CollectionSchema } from '$lib/schemas/collection_schema';
	import type { SubmitFunction } from 'formsnap';
	import { Trash2 } from 'lucide-svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	export let form: SuperValidated<CollectionSchema>;

	const dispatch = createEventDispatcher();

	let loading: boolean = false;

	let selectedColor: CollectionColor = COLLECTION_COLORS[0];

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			loading = false;
			dispatch(result.type, result);
		};
	};

	const cancel = () => dispatch('cancel');

	onMount(() => {
		selectedColor = COLLECTION_COLORS.filter(
			({ value }) => value.toLowerCase() === form.data.color.toLowerCase()
		)[0];
	});

	const onColorSelectedChange = ({ label }: { label: string } & any) => {
		selectedColor = COLLECTION_COLORS.filter((color) => color.label === label)[0];
	};
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

		<Form.Field {config} name="color">
			<Form.Item class="flex flex-col">
				<Form.Label>Color</Form.Label>
				<Form.Select onSelectedChange={onColorSelectedChange}>
					<Select.Trigger value={selectedColor.value}>{selectedColor.label}</Select.Trigger>
					<Select.Content>
						{#each COLLECTION_COLORS as { label, value }}
							<Select.Item {value} {label}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Form.Select>
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
