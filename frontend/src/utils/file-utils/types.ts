import { readdir } from 'fs/promises';

type ArrayElementType<ArrayType extends Array> = ArrayType[number];
type TReaddirResult = ReturnType<typeof readdir>;
type TWalkItems = Awaited<TReaddirResult>;
type TWalkItem = ArrayElementType<TWalkItems>;
export type TWalkEntry = {
	path: string;
	items: TWalkItems;
};
type TWalkItemResult = {
	path: string;
	item: TWalkItem;
	queue: TWalkEntry[];
};

export type TWalkItemsCb = (item: TWalkItemResult | null, next: () => void) => void;
