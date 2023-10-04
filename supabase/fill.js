import supa from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';

const { SupabaseClient } = supa;

dotenv.config();

const author = "37f21f9d-f7f5-4105-953d-fc9264f57997";

let numOfFails = 0;
const maxFails = 3;

const generate = async () => {
    const supaUrl = process.env.PUBLIC_SUPABASE_URL;
    const supaKey = process.env.PRIVATE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supaUrl || !supaKey) {
        console.log('Missing PUBLIC_SUPABASE_URL or PRIVATE_SUPABASE_SERVICE_ROLE_KEY');
        return;
    }

    const supabase = new SupabaseClient(supaUrl, supaKey);
    await supabase.from("cards_collections").delete().eq("author", author);

    for (let i = 0; i < 25; i++) {
        const collection = {
            uid: nanoid(),
            author,
            name: `Fill ${i}`,
            is_public: true
        };
        console.log(`Generating ${i}`);


        const { error, status } = await supabase.from('collections').insert(collection);

        if (error) {
            console.error(`[${error.code}] <${status}> while creating collection: ${error.message}`);

            numOfFails++;
            console.error(`Failed to insert ${i} ${numOfFails}/${maxFails}`);
            if (numOfFails === maxFails) { console.error(`Aborting since fail limit has been reached (${maxFails})`); return; }
            continue;
        }

        console.log(`Inserted ${i}`);
    }

    console.log(`Filled finished with ${numOfFails}/${maxFails} fails`);
};

generate();