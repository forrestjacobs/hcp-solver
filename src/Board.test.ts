import { Board } from "./Board";

const WIDTH = 2;
const HEIGHT = 3;
const COLORS = 4;

describe("A board", () => {
    const board = new Board(WIDTH, HEIGHT, COLORS);

    it("can be created from a width, height, and set of colors", () => {
        expect(board.width).toEqual(WIDTH);
        expect(board.height).toEqual(HEIGHT);
        expect(board.colors).toEqual(COLORS);

        expect(board.cells).toHaveLength(WIDTH * HEIGHT);

        for (const cell of board.cells) {
            expect(cell).toEqual([true, true, true, true]);
        }
    });

    it("knows when it's solved", () => {
        expect(board.isSolved()).toEqual(false);

        expect(board.withCells([
            [true, false, false, false], [false, true, false, false],
            [false, false, true, false], [false, false, false, true],
            [true, false, false, false], [false, true, false, false],
        ]).isSolved()).toEqual(true);

        expect(board.withCells([
            [true, false, false, false], [false, true, false, false],
            [false, true, true, false], [false, false, false, true],
            [true, false, false, false], [false, true, false, false],
        ]).isSolved()).toEqual(false);
    });

    it("can map its cells", () => {
        const mapped = board.map((line) =>
            line.map((cell, cellIndex) =>
                cell.map((colorValue, colorIndex) =>
                    colorValue && cellIndex === colorIndex)));

        expect(mapped.cells).toEqual([
            [true, false, false, false], [false, false, false, false],
            [false, false, false, false], [false, true, false, false],
            [false, false, false, false], [false, false, false, false],
        ]);
    });
});
