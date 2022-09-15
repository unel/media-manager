import { readdir } from 'fs/promises';

import type { TWalkEntry } from './types';

export async function getWalkEntry(path: string): Promise<TWalkEntry> {
	const items = await readdir(path, { withFileTypes: true });

	return { path, items };
}
