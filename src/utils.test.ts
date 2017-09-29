import { chunk, countMagnitudeWhere, countWhere } from "./utils";

describe("util.countMagnitudeWhere", () => {

    it("returns 0 when there are no matching items", () => {
        expect(countMagnitudeWhere([], (x) => x)).toEqual(0);
        expect(countMagnitudeWhere([false], (x) => x)).toEqual(0);
    });

    it("returns 1 when there is 1 matching item", () => {
        expect(countMagnitudeWhere([true], (x) => x)).toEqual(1);
        expect(countMagnitudeWhere([true, false], (x) => x)).toEqual(1);
        expect(countMagnitudeWhere([false, true], (x) => x)).toEqual(1);
    });

    it("returns 2 when there are 2 or more matching item", () => {
        expect(countMagnitudeWhere([true, true], (x) => x)).toEqual("many");
        expect(countMagnitudeWhere([true, false, true], (x) => x)).toEqual("many");
        expect(countMagnitudeWhere([true, true, true], (x) => x)).toEqual("many");
    });

});

describe("util.countWhere", () => {
    it("returns the number of matching items", () => {
        expect(countWhere([], (x) => x)).toEqual(0);
        expect(countWhere([false], (x) => x)).toEqual(0);
        expect(countWhere([true], (x) => x)).toEqual(1);
        expect(countWhere([true, false], (x) => x)).toEqual(1);
        expect(countWhere([true, true], (x) => x)).toEqual(2);
        expect(countWhere([true, true, true], (x) => x)).toEqual(3);
    });
});

describe("util.chunk", () => {

    it("chunks empty arrays", () => {
        expect(chunk([], 1)).toEqual([]);
    });

    it("chunks arrays with a smaller length than the given chunk size", () => {
        expect(chunk([1, 2], 3)).toEqual([[1, 2]]);
    });

    it("chunks arrays that fit evenly in the given chunk size ", () => {
        expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([[1, 2, 3], [4, 5, 6]]);
    });

    it("chunks arrays that don't fit evenly in the given chunk size ", () => {
        expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([[1, 2, 3], [4, 5]]);
    });

});
