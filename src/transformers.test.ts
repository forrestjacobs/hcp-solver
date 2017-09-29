import * as transformers from "./transformers";
import { LineDescription, Rule, Transformer, TransformResult } from "./types";

function oneRuleTransformer(transformer: Transformer):
        (contiguous: boolean, count?: number, line?: LineDescription) => TransformResult {
    return (contiguous, count, line) => transformer(line || [], [{ contiguous, count: count || 0 }], 0);
}

function multiRuleTransformer(transformer: Transformer):
        (rules: Rule[], line?: LineDescription) => TransformResult {
    return (rules, line) => transformer(line || [], rules, 0);
}

test("notInLine", () => {
    const transform = oneRuleTransformer(transformers.notInLine);
    expect(transform(false, 1)).toBe(undefined);
    expect(transform(false, 0)).toBe("remove");
});

test("alreadyDone", () => {
    const transform = oneRuleTransformer(transformers.alreadyDone);
    expect(transform(false, 2, ["off", "on", "off", "off"])).toBe(undefined);
    expect(transform(false, 2, ["on", "exclusive", "off", "on"])).toBe(undefined);
    expect(transform(false, 2, ["off", "on", "exclusive", "off"]))
        .toEqual(new Array(4).fill("exclusive", 1, 2));
});

test("removeOtherRuns", () => {
    const transform = oneRuleTransformer(transformers.removeOtherRuns);
    expect(transform(false)).toBe(undefined);
    expect(transform(true, 2, ["on", "off"])).toBe(undefined);
    expect(transform(true, 3, ["on", "exclusive", "on", "on", "off", "on", "on", "off", "on"]))
        .toEqual(new Array(9).fill("remove", 5, 7).fill("remove", 8, 9));
});

test("removeSmallRuns", () => {
    const transform = oneRuleTransformer(transformers.removeSmallRuns);
    expect(transform(false)).toBe(undefined);
    expect(transform(true, 3, ["off", "on", "on", "off", "on", "exclusive", "on", "on"]))
        .toEqual(new Array(8).fill("remove", 1, 3));
});

test("fillInRunCenter", () => {
    const transform = oneRuleTransformer(transformers.fillInRunCenter);
    expect(transform(false)).toBe(undefined);
    expect(transform(true, 2, ["on", "exclusive", "off", "on", "on"])).toBe(undefined);
    expect(transform(true, 2, ["on", "on", "off", "on"])).toEqual(new Array(4).fill("exclusive", 0, 2));
    expect(transform(true, 2, new Array(2).fill("on"))).toEqual(new Array(2).fill("exclusive"));
    expect(transform(true, 2, new Array(3).fill("on"))).toEqual(new Array(3).fill("exclusive", 1, 2));
    expect(transform(true, 2, new Array(4).fill("on"))).toEqual(new Array(4));
    expect(transform(true, 3, new Array(3).fill("on"))).toEqual(new Array(3).fill("exclusive"));
    expect(transform(true, 3, new Array(4).fill("on"))).toEqual(new Array(4).fill("exclusive", 1, 3));
    expect(transform(true, 3, new Array(5).fill("on"))).toEqual(new Array(5).fill("exclusive", 2, 3));
    expect(transform(true, 3, new Array(6).fill("on"))).toEqual(new Array(6));
});

test("fillInGutters", () => {
    const oneRuleTransform = oneRuleTransformer(transformers.fillInGutters);
    expect(oneRuleTransform(true)).toBe(undefined);
    expect(oneRuleTransform(false, 1)).toBe(undefined);
    expect(oneRuleTransform(false, 2)).toBe(undefined);

    const multiRuleTransform = multiRuleTransformer(transformers.fillInGutters);
    expect(multiRuleTransform([
        { contiguous: false, count: 2 },
        { contiguous: false, count: 1 },
        { contiguous: true, count: 7 },
    ])).toBe(undefined);
    expect(multiRuleTransform(
        [{ contiguous: false, count: 2 },
         { contiguous: true, count: 8 }],
        new Array(10).fill("on"),
    )).toEqual(new Array(10).fill("exclusive", 0, 1).fill("exclusive", 9, 10));
});

test("breakUpRun", () => {
    const transform = oneRuleTransformer(transformers.breakUpRun);
    expect(transform(true)).toBe(undefined);
    expect(transform(false, 3, ["exclusive", "on", "exclusive"])).toBe(undefined);
    expect(transform(false, 3, ["exclusive", "exclusive", "on"])).toEqual(new Array(3).fill("remove", 2, 3));
    expect(transform(false, 3, ["on", "exclusive", "exclusive"])).toEqual(new Array(3).fill("remove", 0, 1));
});

test("setOne", () => {
    const transform = oneRuleTransformer(transformers.setOne);
    expect(transform(true)).toBe(undefined);
    expect(transform(false, 0, ["off", "on", "exclusive"])).toBe(undefined);
    expect(transform(false, 0, ["on", "on", "off", "on", "on"])).toBe(undefined);
    expect(transform(false, 3, ["on", "off", "on", "off", "on"])).toBe(undefined);
    expect(transform(false, 3, ["on", "off", "on", "on", "on"])).toBe(undefined);
    expect(transform(false, 3, ["off", "on", "off", "on", "on"])).toEqual(new Array(5).fill("exclusive", 1, 2));
});
