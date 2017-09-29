import { Dimension } from "./types";
import { chunk, countMagnitudeWhere } from "./utils";

export type Cell = boolean[];
export type Line = Cell[];

export class Board {

    public readonly cells: Line;
    public readonly colors: number;
    public readonly height: number;
    public readonly width: number;

    public constructor(width: number, height: number, colors: number, cells?: Line) {
        this.width = width;
        this.height = height;
        this.colors = colors;

        if (cells !== undefined) {
            this.cells = cells;
        } else {
            const cell: Cell = new Array(colors).fill(true);
            this.cells = Array.from({length: width * height}, () => cell.slice());
        }
    }

    public isSolved(): boolean {
        // Solved if all cells have exactly one color filled in
        return this.cells.every((cell) => countMagnitudeWhere(cell, (x) => x) === 1);
    }

    public map(callbackfn: (line: Line, dimension: Dimension, index: number) => Line): Board {
        const cells: Cell[] = chunk(this.cells, this.width)
            .reduce((acc, line, rowIndex) => [...acc, ...callbackfn(line, "row", rowIndex)], []);
        for (let columnIndex = 0; columnIndex < this.width; columnIndex++) {
            const slice = Array.from({length: this.height}, (_, rowIndex) =>
                cells[rowIndex * this.width + columnIndex]);
            callbackfn(slice, "column", columnIndex)
                .forEach((value, rowIndex) => cells[rowIndex * this.width + columnIndex] = value);
        }
        return this.withCells(cells);
    }

    public withCells(cells: Line): Board {
        return new Board(this.width, this.height, this.colors, cells);
    }

}
