import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import supa from '@supabase/supabase-js';
import data from './data.json' assert { type: 'json' };

const { SupabaseClient } = supa;

dotenv.config();

const author = "37f21f9d-f7f5-4105-953d-fc9264f57997";

const generateCards = (collection) => {
	const cards = [];
	for (const cardData of collection.cards) {
		const card = {
			uid: nanoid(),
			collection: collection.uid,
			question: cardData.question,
			answer: cardData.answer,
			created_at: cardData.created_at
		};
		cards.push(card);
	}
	return cards;
};

const generateCollection = (collection) => {
	collection.uid = nanoid();
	collection.author = author;
	collection.color = "#FF00FF";

	const cards = generateCards(collection);

	delete collection.cards;

	return { collection, cards };
};

const generate = async () => {
	const supaUrl = process.env.PUBLIC_SUPABASE_URL;
	const supaKey = process.env.PRIVATE_SUPABASE_SERVICE_ROLE_KEY;

	if (!supaUrl || !supaKey) {
		console.log('Missing PUBLIC_SUPABASE_URL or PRIVATE_SUPABASE_SERVICE_ROLE_KEY');
		return;
	}

	const supabase = new SupabaseClient(supaUrl, supaKey);
	await supabase.from("collections").delete().eq("author", author);

	for (const col of data.collections) {
		const { collection, cards } = generateCollection(col);
		console.log(`Generating ${collection.name}`);


		const collectionCreated = await insertCollection(supabase, collection);
		if (!collectionCreated) {
			console.warn(`Aborting collection "${collection.name}" creation.`);
			continue;
		}

		const cardsCreated = await insertCards(supabase, cards);
		if (cardsCreated) {
			console.log(`Data generation successful for "${collection.name}"`);
		} else {
			console.warn(`Aborting collection "${collection.name}" cards creation`);
			continue;
		}
	}
};

const insertCollection = async (supabase, collection) => {
	const { error, status } = await supabase.from('collections').insert(collection);

	if (error) {
		console.error(`[${error.code}] <${status}> while creating collection: ${error.message}`);
		return false;
	}

	return true;
};

const insertCards = async (supabase, cards) => {
	const { error, status } = await supabase.from('cards').insert(cards);

	if (error) {
		console.error(`[${error.code}] <${status}> while creating cards: ${error.message}`);
		return false;
	}

	return true;
};

generate();
