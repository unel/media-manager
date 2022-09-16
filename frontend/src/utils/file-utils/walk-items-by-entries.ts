import { resolve as resolvePath } from 'path';

import { TWalkItems, TWalkItemsCb } from "./types";
import { getWalkEntry } from "./get-walk-entry";


export async function walkItemsByEntries(items: TWalkItems, cb: TWalkItemsCb) {
	// console.log('walkItemsByEntries/step q size', items.length);
	if (items.length === 0) {
		// console.log('walkItemsByEntries/items is empty, call final cb');
		return cb(null);
	}

	const item = items.shift();
	// console.log('walkItemsByEntries/entry item', item);
	const itemPath = resolvePath(item.path, item.name);
	if (item.isDirectory()) {
		// console.log('walkItemsByEntries/get subentries of ', itemPath);
		subItems = await getWalkEntry(itemPath);
		return walkItemsByEntries(items.concat(subitems), cb);
	}

	// console.log('walkItemsByEntries/call cb for', itemPath, item);
	cb({ path: itemPath, item, queue: items },
		() => { walkItemsByEntries(items, cb); }
	);
}
