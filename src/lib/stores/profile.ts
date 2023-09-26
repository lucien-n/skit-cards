import { cfetch, type Fetch } from '$lib/cfetch';
import { writable, type Invalidator, type Subscriber } from 'svelte/store';

type ProfileStore = {
	subscribe: (
		this: void,
		run: Subscriber<TProfile | null>,
		invalidate?: Invalidator<TProfile | null>
	) => () => void;
	set: (value: TProfile | null) => void;
	update: (updater: (value: TProfile | null) => TProfile | null) => void;
	refresh: (fetch: Fetch, uid?: string) => void;
};

const createProfileStore = (): ProfileStore => {
	const { subscribe, set, update } = writable<TProfile | null>(null);

	const refresh = async (fetch: Fetch, uid?: string) => {
		update((currentProfile: TProfile | null) => {
			if (!currentProfile && !uid) return null;

			const fetchProfile = async () => {
				const { data, error } = await cfetch(`/api/users/${uid}/profile`, 'GET', fetch);
				if (error) {
					console.warn(error);
					return;
				}

				const newProfile = data[0] as TProfile;
				set(newProfile);
			};
			if (uid) fetchProfile();

			return currentProfile;
		});
	};

	return {
		subscribe,
		set,
		update,
		refresh
	};
};

const profileStore: ProfileStore = createProfileStore();

export default profileStore;
