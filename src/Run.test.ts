import { Run } from "./Run";

const START = 1;
const END = 3;

function identity<T>(value: T): T {
    return value;
}

describe("A run", () => {
    const run = new Run(START, END);

    it("can be created from an array", () => {
        expect(Run.fromArray([], identity)).toEqual([]);
        expect(Run.fromArray([false], identity)).toEqual([]);
        expect(Run.fromArray([true], identity)).toEqual([new Run(0, 1)]);
        expect(Run.fromArray([false, true, false], identity)).toEqual([new Run(1, 2)]);
        expect(Run.fromArray([false, true, true], identity)).toEqual([new Run(1, 3)]);
        expect(Run.fromArray([true, true, false, false, true, true], identity)).toEqual([new Run(0, 2), new Run(4, 6)]);
    });

    it("can be turned back to an array", () => {
        expect(Run.toArray(0, [], true)).toEqual([]);
        expect(Run.toArray(1, [new Run(0, 1)], true)).toEqual([true]);
        expect(Run.toArray(3, [new Run(1, 2)], true)).toEqual([undefined, true, undefined]);
        expect(Run.toArray(6, [new Run(0, 2), new Run(4, 6)], true))
            .toEqual([true, true, undefined, undefined, true, true]);
        expect(Run.toArray(4, [new Run(1, 4), new Run(2, 3)], true)).toEqual([undefined, true, true, true]);
    });

    it("can be created from a start and end value", () => {
        expect(run.start).toBe(START);
        expect(run.end).toBe(END);
    });

    it("has a length", () => {
        expect(run.length).toBe(2);
    });

    it("knows which values it contains", () => {
        expect(run.contains(0)).toBe(false);
        expect(run.contains(1)).toBe(true);
        expect(run.contains(2)).toBe(true);
        expect(run.contains(3)).toBe(false);
    });

});
