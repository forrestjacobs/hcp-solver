export function chunk<T>(array: ReadonlyArray<T>, size: number): T[][] {
    const result: T[][] = [];
    const length = array.length;
    for (let i = 0; i < length; i += size) {
        result.push(array.slice(i, Math.min(length, i + size)));
    }
    return result;
}

export function countMagnitudeWhere<T>(array: ReadonlyArray<T>, predicate: (value: T) => boolean): 0 | 1 | "many" {
    let count: 0 | 1 = 0;
    for (const value of array) {
        if (predicate(value)) {
            switch (count) {
                case 0: count = 1; break;
                case 1: return "many";
                default:
            }
        }
    }
    return count;
}

export function countWhere<T>(array: ReadonlyArray<T>, predicate: (value: T) => boolean): number {
    let count = 0;
    for (const value of array) {
        if (predicate(value)) {
            count++;
        }
    }
    return count;
}
