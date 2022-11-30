/**  IMPORTANT NOTE FOR READERS
* For this program I not choose the TDD approach, instead I create these test after the develop of the code.
* These test are not complete, only a scratch of a real developing.
*/

// import { Request, Response, NextFunction } from "express";
import { strict as assert } from 'assert'
import { Point, cartesianXyGrid, Directions, xyCoords } from "./interfaces/cartesian";
import MapController from './controllers/map';
import RoverController from './controllers/rover';

import http from "http";
import express, { Express } from "express";
const app: Express = express();

/** Server */
const httpServer = http.createServer(app);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
  console.log("http://localhost:" + PORT);
});

/** Socket logic */
import { Server, Socket } from "socket.io";
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8080", "https://mars-rover-vue-v2.netlify.app/"]
  }
}); // init a new istance of socket.io passing the http server

let roverTest = new RoverController(io);
let mapTest = new MapController();

export function testGetRouteList() {
  assert.deepStrictEqual(roverTest.getRoutesList(), ["mapInfo", "roverInfo", "roverMove"]);  
}

export function testGenerateMap() {
  let map:cartesianXyGrid = mapTest.generateMap();
  assert(typeof(map) == 'object');
}

export function testGenerateObstacles() {
  let obstacles:cartesianXyGrid = mapTest.generateObstacles(mapTest.defaultObstacleNumber);
  assert(typeof(obstacles) == 'object');
  assert.equal(obstacles.length, mapTest.defaultObstacleNumber);
}

export function testGetRandomNumber() {
  let n:number = mapTest.getRandomNumber(20);
  assert.ok(n > 0 && n <= 20);
}

export function testGetRandomDirection() {
  let direction:Directions = mapTest.getRandomDirection();
  assert.ok(typeof(direction) == 'string');
  assert(['N','E','S','W'].find((el) => el.includes(direction)));
}