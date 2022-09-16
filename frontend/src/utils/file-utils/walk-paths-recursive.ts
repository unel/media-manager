import { resolve as resolvePath } from 'path';
import { stat } from 'fs/promises';

import { TWalkItems, TWalkItemsCb } from "./types";
import { getWalkEntry } from "./get-walk-entry";


export async function walkPathsRecursive(paths: string[], cb: TWalkItemsCb) {
	// console.log('walkItemsByEntries/step q size', paths.length);
	if (paths.length === 0) {
		// console.log('walkItemsByEntries/items is empty, call final cb');
		return cb(null);
	}

	const path = paths.shift();
	const info = await stat(path);
	// console.log('walkItemsByEntries/entry', path);
	if (info.isDirectory()) {
		// console.log('walkItemsByEntries/get subentries of ', path);
		subItems = await getWalkEntry(path);
		return walkPathsRecursive(paths.concat(subItems), cb);
	}

	// console.log('walkItemsByEntries/call cb for', path);
	cb({ path: path, queue: paths },
		() => { walkPathsRecursive(paths, cb); }
	);
}
