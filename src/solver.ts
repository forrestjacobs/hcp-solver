import { Board, Cell, Line } from "./Board";
import { BoardRules, CellDescription, Rule, SolvedBoard, Transformer, TransformInstruction } from "./types";
import { chunk, countMagnitudeWhere } from "./utils";

export type InstructionFunctions = {
    [T in TransformInstruction]: (cell: boolean[], color: number) => void;
};

const instructionFunctions: InstructionFunctions = {
    exclusive: (cell, color) => {
        for (let i = 0; i < cell.length; i++) {
            cell[i] = i === color;
        }
    },
    remove: (cell, color) => cell[color] = false,
};

function cellDescriber(color: number): (cell: Cell) => CellDescription {
    return (cell) => {
        if (!cell[color]) {
            return "off";
        }
        return countMagnitudeWhere(cell, (v) => v) === 1 ? "exclusive" : "on";
    };
}

function transformLine(line: Line, transformer: Transformer, lineRules: Rule[]): Line {
    const result = line.map((cell) => cell.slice());
    for (let color = 0; color < lineRules.length; color++) {
        const colorLine = line.map(cellDescriber(color));
        const instructions = transformer(colorLine, lineRules, color);
        for (let index = 0; index < line.length; index++) {
            const instruction = (instructions instanceof Array) ? instructions[index] : instructions;
            if (instruction !== undefined) {
                instructionFunctions[instruction](result[index], color);
            }
        }
    }
    return result;
}

export function solve(rules: BoardRules, transformers: ReadonlyArray<Transformer>): SolvedBoard | undefined {
    const {row, column} = rules;
    const colors = row[0].length;

    function transform(board: Board, transformer: Transformer): Board {
        return board.map((line, dimension, index) => transformLine(line, transformer, rules[dimension][index]));
    }

    function iterate(board: Board): SolvedBoard | undefined {
        if (board.isSolved()) {
            const colorLine = board.cells.map((cell) => cell.indexOf(true));
            return chunk(colorLine, board.width);
        }

        const transformed = transformers.reduce(transform, board);
        return (JSON.stringify(board) === JSON.stringify(transformed)) ? undefined : iterate(transformed);
    }

    return iterate(new Board(column.length, row.length, colors));
}
