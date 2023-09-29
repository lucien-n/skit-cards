import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import supa from '@supabase/supabase-js';

const { SupabaseClient } = supa;

dotenv.config();

const collection = {
	uid: nanoid(),
	name: 'Capitals of Europe',
	author: '37f21f9d-f7f5-4105-953d-fc9264f57997',
	is_public: true,
	created_at: new Date().toUTCString()
};

const capitals = [
	['France', 'Paris'],
	['Germany', 'Berlin'],
	['Luxembourg', 'Luxembourg'],
	['United Kingdom', 'London'],
	['Japan', 'Tokyo']
];

const generateCards = () => {
	const cards = [];
	for (const [country, capital] of capitals) {
		const card = {
			uid: nanoid(),
			collection: collection.uid,
			question: `What is the capital of ${country}?`,
			answer: capital
		};
		cards.push(card);
	}
	return cards;
};

const generate = async () => {
	const supaUrl = process.env.PUBLIC_SUPABASE_URL;
	const supaKey = process.env.PRIVATE_SUPABASE_SERVICE_ROLE_KEY;

	if (!supaUrl || !supaKey) {
		console.log('Missing PUBLIC_SUPABASE_URL or PRIVATE_SUPABASE_SERVICE_ROLE_KEY');
		return;
	}

	const supabase = new SupabaseClient(supaUrl, supaKey);

	const collectionCreated = await insertCollection(supabase);
	if (!collectionCreated) {
		console.warn('Aborting since collection creation failed.');
		return;
	}

	const cardsCreated = await insertCards(supabase);
	if (cardsCreated) {
		console.log('Data generation successful');
	} else {
		console.warn('Aborting since cards creation failed.');
		return;
	}
};

const insertCollection = async (supabase) => {
	const { error } = await supabase.from('cards_collections').insert(collection);

	if (error) {
		console.error(`[${error.code}] while creating collection: ${error.message}`);
		return false;
	}

	return true;
};

const insertCards = async (supabase) => {
	const { error } = await supabase.from('cards').insert(generateCards());

	if (error) {
		console.error(`[${error.code}] while creating cards: ${error.message}`);
		return false;
	}

	return true;
};

generate();
