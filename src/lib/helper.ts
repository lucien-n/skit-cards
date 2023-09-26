import { PREFIX } from './constants';
import { titleStore } from './stores';

export const setTitle = (title: string, prefix: boolean = false) => {
	if (prefix) titleStore.set(`${PREFIX} - ${title}`);
	titleStore.set(title);
};
