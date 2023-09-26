import { writable } from 'svelte/store';

const titleStore = writable<string>('Cards');

export default titleStore;
