import type { TWalkItemsCb } from "./types";
import { getWalkEntry } from "./get-walk-entry";
import { walkPathsRecursive } from "./walk-paths-recursive";


export async function walkDirItems(dir: string, cb: TWalkItemsCb): void {
	walkPathsRecursive([dir], cb);
}
