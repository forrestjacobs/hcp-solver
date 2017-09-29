export type Dimension = "column" | "row";

export interface Rule {
    contiguous?: boolean;
    count: number;
}

export type BoardRules = {
    [D in Dimension]: Rule[][];
};

export type SolvedBoard = number[][];

export type CellDescription = "exclusive" | "on" | "off";
export type LineDescription = CellDescription[];

export type TransformInstruction = "exclusive" | "remove";
export type OptionalTransformInstruction = TransformInstruction | undefined;
export type TransformResult = OptionalTransformInstruction | OptionalTransformInstruction[];

export type Transformer = (line: LineDescription, rules: Rule[], color: number) => TransformResult;
