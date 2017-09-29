// tslint:disable:member-ordering
export class Run {

    public static fromArray<T>(array: ReadonlyArray<T>, callbackfn: (value: T) => boolean): Run[] {
        const length = array.length;
        const result: Run[] = [];

        let start: number | undefined;
        for (let index = 0; index < length; index++) {
            const isTrue = callbackfn(array[index]);
            if (isTrue && start === undefined) {
                start = index;
            } else if (!isTrue && start !== undefined) {
                result.push(new Run(start, index));
                start = undefined;
            }
        }
        if (start !== undefined) {
            result.push(new Run(start, length));
        }
        return result;
    }

    public static toArray<T>(length: number, runs: ReadonlyArray<Run>, value: T): Array<T | undefined> {
        const results = new Array<T | undefined>(length);
        for (const run of runs) {
            results.fill(value, run.start, run.end);
        }
        return results;
    }

    public readonly start: number;
    public readonly end: number;

    public get length(): number {
        return this.end - this.start;
    }

    public constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    public contains(value: number): boolean {
        return this.start <= value && this.end > value;
    }

}
