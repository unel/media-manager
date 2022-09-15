export function times<T = any>(amount: number, fn: (amountIndex: number) => T): T[] {
    const result = [];

    for (let amountIndex = 0; amountIndex < amount; amountIndex++) {
        result.push(fn(amountIndex));
    }

    return result;
}
