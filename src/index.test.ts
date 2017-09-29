import { solve } from "./index";
import * as solver from "./solver";
import { transformers } from "./transformers";

const fiveZero = [{ contiguous: true, count: 5 },
                  { count: 0 }];
const twoThree = [{ contiguous: true, count: 2 },
                  { contiguous: true, count: 3 }];
const rules = {
    column: [twoThree, twoThree, twoThree, fiveZero, fiveZero],
    row:    [fiveZero, fiveZero, twoThree, twoThree, twoThree],
};

const solvedBoard = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [1, 1, 1, 0, 0],
    [1, 1, 1, 0, 0],
];

test("api", () => {
    const solveSpy = jest.spyOn(solver, "solve");
    solveSpy.mockImplementation(() => solvedBoard);
    expect(solve(rules)).toBe(solvedBoard);
    expect(solveSpy).toBeCalledWith(rules, transformers);
    solveSpy.mockRestore();
});
