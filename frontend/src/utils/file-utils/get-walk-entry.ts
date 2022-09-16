import { readdir } from 'fs/promises';

import type { TWalkEntry } from './types';

export async function getWalkEntry(path: string): Promise<TWalkEntry> {
	const dirItems = await readdir(path, { withFileTypes: true });

	for (const item of dirItems) {
		item.path = path;
	}

	return dirItems;
}
