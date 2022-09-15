import { TWalkEntry } from "./types";


export function computeWalkDirItemsQueueSize(walkEntries: TWalkEntry[]) {
	return walkEntries.reduce((acc, entry) => acc + entry.items.length, 0);
}
