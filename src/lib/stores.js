import { writable } from 'svelte/store';

export const mouseX = writable(undefined);
export const mouseY = writable(undefined);
export const hoveredDatapoint = writable(undefined);
