import { random } from '$utils/number-utils';
import { times } from '$utils/fn-utils';


export function pickRandomElement<T = any>(array: T[]): T {
    const randomIndex = random({ from: 0, to: array.length - 1 });

    return array[randomIndex];
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
