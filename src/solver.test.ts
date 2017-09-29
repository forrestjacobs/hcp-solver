import { solve } from "./solver";
import { OptionalTransformInstruction } from "./types";

const fiveZero = [
    { contiguous: true,  count: 5 },
    { contiguous: false, count: 0 },
];
const twoThree = [
    { contiguous: true, count: 2 },
    { contiguous: true, count: 3 },
];
const boardRules = {
    column: [twoThree, twoThree, twoThree, fiveZero, fiveZero],
    row:    [fiveZero, fiveZero, twoThree, twoThree, twoThree],
};

describe("solver", () => {
    it("should solve puzzles", () => {
        const board = solve(
            boardRules,
            [
                (line, rules, color) => rules[color].count === 5 ? "exclusive" : undefined,
                (line, rules, color) => {
                    const onCount = line.filter((cell) => cell === "on").length;
                    if (rules[color].count !== 2 || onCount !== 3) {
                        return undefined;
                    }
                    return line.map((cell): OptionalTransformInstruction => cell === "on" ? "remove" : undefined);
                },
            ],
        );

        expect(board).toEqual([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [1, 1, 1, 0, 0],
            [1, 1, 1, 0, 0],
            [1, 1, 1, 0, 0],
        ]);
    });

    it("should not solve unsolvable puzzles", () => {
        const board = solve(boardRules, []);
        expect(board).toBeUndefined();
    });
});
