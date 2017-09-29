import { forColorRule, notOff, restrictContiguousTo } from "./transformerUtils";
import { LineDescription } from "./types";

const LINE: LineDescription = ["exclusive", "on", "off"];

test("forColorRule", () => {
    const rule = { count: 2, contiguous: true };
    const callback = jest.fn(() => "exclusive");

    expect(forColorRule(callback)(LINE, [{count: 1}, rule], 1)).toBe("exclusive");
    expect(callback).toBeCalledWith(LINE, rule);
});

test("notOff", () => {
    expect(notOff("exclusive")).toBe(true);
    expect(notOff("on")).toBe(true);
    expect(notOff("off")).toBe(false);
});

describe("restrictContiguousTo", () => {
    const contiguousRules = [
        { count: 1 },
        { count: 1, contiguous: true },
        { count: 1, contiguous: false },
        { count: 2, contiguous: true },
    ];
    const uncontiguousRules = [
        { count: 2, contiguous: false },
        { count: 2 },
    ];

    it("blocks all calls when rule has count 0", () => {
        const neitherRule = { count: 0 };
        const callback = jest.fn(() => "exclusive");
        expect(restrictContiguousTo(true, callback)(LINE, [neitherRule], 0)).toBeUndefined();
        expect(restrictContiguousTo(false, callback)(LINE, [neitherRule], 0)).toBeUndefined();
        expect(callback).toHaveBeenCalledTimes(0);
    });

    it("blocks calls when contiguous parameter doesn't match the given rule", () => {
        const callback = jest.fn(() => "exclusive");
        for (let ruleIndex = 0; ruleIndex < contiguousRules.length; ruleIndex++) {
            expect(restrictContiguousTo(false, callback)(LINE, contiguousRules, ruleIndex)).toBeUndefined();
        }
        for (let ruleIndex = 0; ruleIndex < uncontiguousRules.length; ruleIndex++) {
            expect(restrictContiguousTo(true, callback)(LINE, uncontiguousRules, ruleIndex)).toBeUndefined();
        }
        expect(callback).toHaveBeenCalledTimes(0);
    });

    it("forwards calls when contiguous parameter matches the given rule", () => {
        const trueCallback = jest.fn(() => "exclusive");
        for (let ruleIndex = 0; ruleIndex < contiguousRules.length; ruleIndex++) {
            expect(restrictContiguousTo(true, trueCallback)(LINE, contiguousRules, ruleIndex)).toBe("exclusive");
        }
        expect(trueCallback).toHaveBeenCalledTimes(contiguousRules.length);

        const falseCallback = jest.fn(() => "remove");
        for (let ruleIndex = 0; ruleIndex < uncontiguousRules.length; ruleIndex++) {
            expect(restrictContiguousTo(false, falseCallback)(LINE, uncontiguousRules, ruleIndex)).toBe("remove");
        }
        expect(falseCallback).toHaveBeenCalledTimes(uncontiguousRules.length);
    });
});
