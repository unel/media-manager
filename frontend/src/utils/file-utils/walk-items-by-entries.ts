import { resolve as resolvePath } from 'path';

import { TWalkEntry, TWalkItemsCb } from "./types";
import { getWalkEntry } from "./get-walk-entry";


export async function walkItemsByEntries(walkEntries: TWalkEntry[], cb: TWalkItemsCb) {
	// console.log('walkItemsByEntries/step', walkEntries.length);
	if (walkEntries.length === 0) {
		// console.log('walkItemsByEntries/entires is empty, call final cb');
		return cb(null);
	}

	const entry = walkEntries[0];
	// console.log('walkItemsByEntries/entry', entry);
	if (entry.items.length === 0) {
		// console.log('walkItemsByEntries/shifting enties');
		walkEntries.shift();
		return walkItemsByEntries(walkEntries, cb);
	}

	const item = entry.items.shift();
	const itemPath = resolvePath(entry.path, item.name);
	// console.log('walkItemsByEntries/entry item', itemPath, item);
	if (item?.isDirectory()) {
		// console.log('walkItemsByEntries/get subentries of ', itemPath);
		subEntry = await getWalkEntry(itemPath);
		walkEntries.push(subEntry);
		return walkItemsByEntries(walkEntries, cb);
	}

	// console.log('walkItemsByEntries/call cb for', itemPath, item);
	cb({ path: itemPath, item, queue: walkEntries },
		() => { walkItemsByEntries(walkEntries, cb); }
	);
}
