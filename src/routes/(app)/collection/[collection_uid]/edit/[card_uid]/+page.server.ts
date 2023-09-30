import { cfetch } from '$lib/cfetch';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { cardSchema } from './card_schema';

export const load: PageServerLoad = async ({ params: { card_uid }, url: { searchParams } }) => {
	const mode = card_uid === 'new' ? 'new' : 'edit';

	const form = superValidate(cardSchema).then((res) => {
		if (mode === 'edit') {
			const question = searchParams.get('question');
			const answer = searchParams.get('answer');

			if (question && answer) {
				res.data.question = question;
				res.data.answer = answer;
			}
		}

		return res;
	});

	return {
		form,
		mode
	};
};

export const actions: Actions = {
	default: async (event) => {
		const {
			fetch,
			params: { collection_uid, card_uid }
		} = event;
		if (!collection_uid || collection_uid.length !== 21) return;

		const form = await superValidate(event, cardSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const question = form.data.question;
		const answer = form.data.answer;

		const uid = card_uid && card_uid.length === 21 ? card_uid : null;

		const { error, status } = await cfetch<null>(
			`/api/collections/${collection_uid}/cards`,
			uid ? 'PUT' : 'POST',
			fetch,
			{
				body: JSON.stringify({ question, answer, uid }),
				headers: { 'Content-Type': 'application/json' }
			}
		);

		if (error)
			fail(status, {
				error
			});

		if (status === 422)
			return fail(422, {
				error: "Server couldn't process this card"
			});

		return {
			status,
			form
		};
	}
};
