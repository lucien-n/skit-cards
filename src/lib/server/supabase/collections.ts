import { redis } from '$server/redis';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

type GetSupabaseCollectionsOptions = {
	limit?: number;
	offset?: number;
	match?: object | undefined;
	order?: { column: string; ascending: boolean; nullsFirst?: boolean };
	not?: {
		column: string;
		operator: string;
		value: any;
	};
};
export const getSupabaseCollections = async (
	supabase: SupabaseClient,
	options: GetSupabaseCollectionsOptions = {
		limit: 10,
		offset: 0,
		match: {},
		order: {
			column: 'created_at',
			ascending: false,
			nullsFirst: false
		}
	}
) => {
	const query = supabase
		.from('collections')
		.select('uid, name, is_public, author:profiles(name:name), created_at')
		.match(options.match ?? {})
		.range(options.offset ?? 0, (options.limit ?? 10) + (options.offset ?? 0));

	if (options.order)
		query.order(options.order.column, {
			ascending: options.order.ascending,
			nullsFirst: options.order.nullsFirst
		});

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return { error, status };

	if (!data || !(data.length > 0)) return { error, status: 204 };

	const collections: TCollection[] = [];

	for (const collectionData of data) {
		const collection = {
			...collectionData,
			// @ts-ignore
			author: collectionData.author.name || 'Unknown'
		} satisfies TCollection;
		collections.push(collection);
	}

	return { collections, status: 200 };
};

export const getCachedCollections = async (
	keys: string[]
): Promise<{ collections?: TCollection[]; error?: string; status: number }> => {
	if (keys.length === 0) return { status: 204 };

	const cached = await redis.mget(keys);

	const collections: TCollection[] = [];

	for (const cachedCollection of cached) {
		if (!cachedCollection) continue;
		const collection = JSON.parse(cachedCollection);
		if (collection satisfies TCollection) collections.push(collection);
	}

	const status = collections.length > 0 ? 200 : 204;

	return { collections, status };
};

export const getCollections = async (supabase: SupabaseClient, collectionsUids: string[]) => {
	const numOfCollections = collectionsUids.length;

	const {
		collections: cachedCollections,
		error: cachedError,
		status: cachedStatus
	} = await getCachedCollections(collectionsUids);

	if (cachedCollections && cachedCollections.length === numOfCollections)
		return { collections: cachedCollections, status: cachedStatus };

	const cachedCollectionsUids = cachedCollections ? cachedCollections?.map(({ uid }) => uid) : [];
	const remainingUids = cachedCollections
		? collectionsUids.filter((uid) => !cachedCollectionsUids.includes(uid))
		: collectionsUids;

	const {
		collections: supaCollections,
		error: supaError,
		status: supaStatus
	} = await getSupabaseCollections(supabase, {
		not: { column: 'uid', operator: 'in', value: `(${remainingUids})` }
	});

	if (supaError) return { error, supaStatus };

	if (!supaCollections || supaCollections.length === 0) return { status: 204 };

	const returned = { collections: supaCollections, status: supaStatus };

	if (cachedError) return { ...returned, error: cachedError };
	return returned;
};
