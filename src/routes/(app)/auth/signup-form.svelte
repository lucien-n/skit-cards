<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$components/ui/button';
	import * as Form from '$components/ui/form';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { signupSchema, type SignupSchema } from './schema';

	export let form: SuperValidated<SignupSchema>;

	const dispatch = createEventDispatcher();

	let loading = false;
	let showPassword: boolean = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			loading = false;
			// @ts-ignore
			dispatch(result.type, result.data);
		};
	};

	const toggleShowPassword = () => {
		showPassword = !showPassword;
	};
</script>

<Form.Root schema={signupSchema} {form} let:config>
	<form method="POST" action="?/signup" use:enhance={handleSubmit} class="flex flex-col gap-2">
		<Form.Field {config} name="name">
			<Form.Item>
				<Form.Label>Name</Form.Label>
				<Form.Input type="text" placeholder="John Doe" />
				<Form.Description>You don't have to enter your legal name</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
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
				<div class="flex">
					<Form.Input
						type={showPassword ? 'text' : 'password'}
						minlength={8}
						maxlength={255}
						placeholder="●●●●●●●●"
						class="rounded-r-none"
					/>
					<Button on:click={toggleShowPassword} class="rounded-l-none" type="button">
						{#if showPassword}
							<EyeOff />
						{:else}
							<Eye />
						{/if}
					</Button>
				</div>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Button disabled={loading}>{loading ? 'Signing Up' : 'Sign Up'}</Form.Button>
	</form>
</Form.Root>
