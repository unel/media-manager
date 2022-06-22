import { random } from '$utils/number-utils';
import { times } from '$utils/fn-utils';


export function pickRandomElementIndex(array: any[]): number {
    return random({ from: 0, to: array.length - 1 });
}

export function pickRandomElement<T = any>(array: T[]): T {
    if (array.length === 0) {
        console.warn('can not pick element from empty array');
        return undefined;
    }

    return array[pickRandomElementIndex(array)];
}

export function pickRandomElements<T = any>(array: T[], amount = 1): T[] {
    return times(amount, () => pickRandomElement(array));
}

export function shuffle<T = any>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
