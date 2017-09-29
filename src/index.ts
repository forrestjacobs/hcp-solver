import * as solver from "./solver";
import { transformers } from "./transformers";
import { BoardRules, Dimension, Rule, SolvedBoard } from "./types";

export { BoardRules, Dimension, Rule, SolvedBoard };

/**
 * Solves Hungry Cat Picross style puzzles
 * @see {@link http://www.tuesdayquest.com/|Tuesday Quest}, developers of Hungry Cat Picross
 * @param rules Rules for solving the puzzle
 * @returns The solved puzzle board
 */
export function solve(rules: BoardRules): SolvedBoard | undefined {
    return solver.solve(rules, transformers);
}
