import { Run } from "./Run";
import { forColorRule, notOff, restrictContiguousTo } from "./transformerUtils";
import { OptionalTransformInstruction, Rule } from "./types";
import { countWhere } from "./utils";

// Remove colors that are not in the line
export const notInLine = forColorRule((line, rule: Rule) => rule.count === 0 ? "remove" : undefined);

// Clear other colors when the current color is definately filled in
export const alreadyDone = forColorRule((line, rule) => {
    if (countWhere(line, notOff) !== rule.count) {
        return undefined;
    }
    return line.map((cell) => cell === "on" ? "exclusive" : undefined);
});

// Remove colors from other runs when we know the correct run
export const removeOtherRuns = restrictContiguousTo(true, (line) => {
    const index = line.indexOf("exclusive");
    if (index === -1) {
        return undefined;
    }

    const otherRuns = Run.fromArray(line, notOff)
        .filter((run) => !run.contains(index));
    return Run.toArray<OptionalTransformInstruction>(line.length, otherRuns, "remove");
});

// Remove runs that are smaller than the current rule's length
export const removeSmallRuns = restrictContiguousTo(true, forColorRule((line, rule) => {
    const smallRuns = Run.fromArray(line, notOff)
        .filter((run) => run.length < rule.count);
    return Run.toArray<OptionalTransformInstruction>(line.length, smallRuns, "remove");
}));

// If there's one run, fill in the center of the run as much as possible
export const fillInRunCenter = restrictContiguousTo(true, forColorRule((line, rule) => {
    const count = rule.count;
    const runs = Run.fromArray(line, notOff)
        .filter((r) => r.length >= count);
    if (runs.length !== 1) {
        return undefined;
    }

    const [run] = runs;
    const results = new Array<OptionalTransformInstruction>(line.length);
    const end = run.start + count;
    for (let index = run.end - count; index < end; index++) {
        results[index] = "exclusive";
    }
    return results;
}));

// If there's one run and one disjointed rule, fill in the left and right cells with the disjointed rule's color
export const fillInGutters = restrictContiguousTo(false, (line, rules, color) => {
    function countWhereContiguous(value: boolean): number {
        return countWhere(rules, (rule) => rule.count > 0 && rule.contiguous === value);
    }

    // tslint:disable-next-line:no-magic-numbers
    if (rules[color].count < 2 || countWhereContiguous(true) !== 1 || countWhereContiguous(false) !== 1) {
        return undefined;
    }

    const results = new Array<OptionalTransformInstruction>(line.length);
    results[0] = "exclusive";
    results[line.length - 1] = "exclusive";
    return results;
});

// If we find a run for a disjointed rule, make sure it's not a full run
export const breakUpRun = restrictContiguousTo(false, forColorRule((line, rule) => {
    const run = Run.fromArray(line, (cell) => cell === "exclusive")
        .find((r) => r.length === rule.count - 1);
    if (run === undefined) {
        return undefined;
    }

    const results = new Array<OptionalTransformInstruction>(line.length);
    if (run.start !== 0) {
        results[run.start - 1] = "remove";
    }
    if (run.end < line.length) {
        results[run.end] = "remove";
    }
    return results;
}));

export const setOne = restrictContiguousTo(false, forColorRule((line, rule) => {
    const runs = Run.fromArray(line, notOff).sort((a, b) => a.length - b.length);

    // tslint:disable-next-line:no-magic-numbers
    if (runs.length !== 2) {
        return undefined;
    }

    const [one, many] = runs;
    if (one.length !== 1 || many.length >= rule.count) {
        return undefined;
    }
    return Run.toArray<OptionalTransformInstruction>(line.length, [one], "exclusive");
}));

export const transformers = [
    notInLine, alreadyDone, removeOtherRuns, removeSmallRuns, fillInRunCenter, fillInGutters, breakUpRun, setOne,
];
