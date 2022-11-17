/**  IMPORTANT NOTE FOR READERS
* For this program I not coose the TDD approach, instead a create the test after the develop of the code.
* The test are not complete because is only an exercise, not a real program.
*/

// import { Request, Response, NextFunction } from "express";
import { strict as assert } from 'assert'
import { Point, cartesianXyGrid, Directions, xyCoords } from "./interfaces/cartesian";
import RoverController from './controllers/rover';

let roverTest = new RoverController();

export function testGetRouteList() {
  assert.deepStrictEqual(roverTest.getRoutesList(), ["mapInfo", "roverInfo", "roverMove"]);  
}

export function testGenerateMap() {
  let map:cartesianXyGrid = roverTest.generateMap();
  assert(typeof(map) == 'object');
}

export function testGenerateObstacles() {
  let obstacles:cartesianXyGrid = roverTest.generateObstacles(roverTest.defaultObstacleNumber);
  assert(typeof(obstacles) == 'object');
  assert.equal(obstacles.length, roverTest.defaultObstacleNumber);
}

export function testGetRandomNumber() {
  let n:number = roverTest.getRandomNumber(20);
  assert.ok(n > 0 && n <= 20);
}

export function testGetRandomDirection() {
  let direction:Directions = roverTest.getRandomDirection();
  assert.ok(typeof(direction) == 'string');
  assert(['N','E','S','W'].find((el) => el.includes(direction)));
}