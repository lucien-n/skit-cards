import { cfetch } from '$lib/cfetch';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { cardSchema } from './card_schema';

export const load: PageServerLoad = async ({
	fetch,
	params: { collection_uid, card_uid },
	url: { origin }
}) => {
	const form = await superValidate(cardSchema);

	if (card_uid.length === 36) {
		const url = new URL(`${origin}/api/collections/${collection_uid}/cards`);
		url.searchParams.set('uid', card_uid);
		const { data } = await cfetch<TFlashcard>(url.href, 'GET', fetch);

		if (data) {
			form.data.question = data.question;
			form.data.answer = data.answer;
		}
	}

	return {
		form,
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
