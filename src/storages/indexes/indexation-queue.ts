import { resolve as resolvePath } from 'path';
import env from '$constants/env';

import { jsonFileStorage } from '$storages/json-file-storage';


export const indexationQueue = jsonFileStorage(resolvePath(env.INDEXES_ROOT, 'indexation-queue.json'));
