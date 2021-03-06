import type { TWalkItemsCb } from "./types";
import { getWalkEntry } from "./get-walk-entry";
import { walkItemsByEntries } from "./walk-items-by-entries";


export async function walkDirItems(dir: string, cb: TWalkItemsCb): void {
	const rootEntry = await getWalkEntry(dir);
	walkItemsByEntries([rootEntry], cb);
}
