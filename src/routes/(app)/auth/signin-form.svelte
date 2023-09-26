<script lang="ts">
	import * as Form from '$components/ui/form';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { signinSchema, type SigninSchema } from './schema';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createEventDispatcher } from 'svelte';

	export let form: SuperValidated<SigninSchema>;

	const dispatch = createEventDispatcher();

	let loading = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;

		return async ({ result }) => {
			loading = false;
			// @ts-ignore
			dispatch(result.type, result.data);
		};
	};
</script>

<Form.Root schema={signinSchema} {form} let:config>
	<form method="POST" action="?/signin" use:enhance={handleSubmit} class="flex flex-col gap-2">
		<Form.Field {config} name="email">
			<Form.Item>
				<Form.Label>Email</Form.Label>
				<Form.Input type="email" placeholder="jhon.doe@mail.com" />
				<Form.Description />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="password">
			<Form.Item>
				<Form.Label>Password</Form.Label>
				<Form.Input type="password" minlength={8} maxlength={255} placeholder="●●●●●●●●" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Button disabled={loading}>{loading ? 'Signing In' : 'Sign In'}</Form.Button>
	</form>
</Form.Root>
