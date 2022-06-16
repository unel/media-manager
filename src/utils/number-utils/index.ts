export function random({ from = 0, to = Number.MAX_SAFE_INTEGER }): number {
    return Math.round(from + Math.random() * (to - from));
}
