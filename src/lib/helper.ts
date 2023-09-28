import { PREFIX } from './constants';
import titleStore from '$lib/stores/title';

export const setTitle = (title: string, prefix: boolean = true) => {
	if (prefix) titleStore.set(`${PREFIX} | ${title}`);
	else titleStore.set(title);
};
