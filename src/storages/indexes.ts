import  { createInmemoryStorage } from './in-memory';

export const indexationStatus = createInmemoryStorage();
export const hashByPath = createInmemoryStorage();
export const metaByHash = createInmemoryStorage();
export const pathsByHash = createInmemoryStorage();
