// type definition for cartesian values
export interface Point {
  y: number;
  x: number;
}
export type cartesianXyGrid = Array<Object>; // [{ y: number, x: number}, ...}
export type Directions = "N" | "E" | "S" | "W";
export type xyCoords = "x" | "y";