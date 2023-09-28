import { cfetch } from '$lib/cfetch';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { cardSchema } from './card_schema';

export const load: PageServerLoad = async ({ params: { card_uid } }) => {
	return {
		form: superValidate(cardSchema),
		mode: card_uid === 'new' ? 'new' : 'edit'
	};
};

export const actions: Actions = {
	default: async (event) => {
		const {
			fetch,
			params: { collection_uid, card_uid }
		} = event;
		if (!collection_uid || collection_uid.length !== 36) return;

		const form = await superValidate(event, cardSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const question = form.data.question;
		const answer = form.data.answer;

		let uid = null;

		if (card_uid && card_uid.length === 36) uid = card_uid;

		const { error, status } = await cfetch<null>(
			`/api/collections/${collection_uid}/cards`,
			card_uid ? 'PUT' : 'POST',
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
			form
		};
	}
};
