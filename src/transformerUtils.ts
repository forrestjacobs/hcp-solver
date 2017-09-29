import { CellDescription, LineDescription, Rule, Transformer, TransformResult } from "./types";

export function forColorRule(cb: (line: LineDescription, rule: Rule) => TransformResult): Transformer {
    return (line, rules, color) => cb(line, rules[color]);
}

export function notOff(cell: CellDescription): boolean {
    return cell !== "off";
}

export function restrictContiguousTo(value: boolean, wrapped: Transformer): Transformer {
    return (line, rules, color) => {
        const {count, contiguous} = rules[color];
        if (count === 0 ||
            count === 1 && !value ||
            count > 1 && (contiguous === undefined && value || contiguous !== undefined && contiguous !== value)) {
            return undefined;
        }
        return wrapped(line, rules, color);
    };
}
