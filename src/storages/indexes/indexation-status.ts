import { createInmemoryStorage } from '$storages/in-memory';

export const indexationStatus = createInmemoryStorage('indexation status');
export const uploadsIndexationStatus = createInmemoryStorage('upload indexation status');
export const uploadsProcessingStatus = createInmemoryStorage('uploads processing');
