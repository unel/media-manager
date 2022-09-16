import { readdir } from 'fs/promises';
import { resolve } from 'path';

import type { TWalkEntry } from './types';

export async function getWalkEntry(path: string): Promise<TWalkEntry> {
	const dirItems = await readdir(path);

	return dirItems.map(item => resolve(path, item));
}
