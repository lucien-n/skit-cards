import { MODE } from '$env/static/private';

const DEV: boolean = MODE == 'DEV';

const CACHE_SETTINGS = {
	card: {
		max_age: 300,
		enabled: DEV
	},
	collection: {
		max_age: 300,
		enabled: DEV
	},
	profile: {
		max_age: 900,
		enabled: DEV
	}
};

type Route = keyof typeof CACHE_SETTINGS;

export const getHeaders = (route: Route) => {
	const route_settings = CACHE_SETTINGS[route];

	const headers: Record<string, string> = {};

	if (route_settings.enabled) headers['Cache-Control'] = `max-age=${route_settings.enabled}`;

	return headers;
};

export const getExpiration = (route: Route) => {
	return DEV ? 30 : CACHE_SETTINGS[route].max_age;
};
