"use strict";
/**  IMPORTANT NOTE FOR READERS
* For this program I not choose the TDD approach, instead I create these test after the develop of the code.
* These test are not complete, only a scratch of a real developing.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testGetRandomDirection = exports.testGetRandomNumber = exports.testGenerateObstacles = exports.testGenerateMap = exports.testGetRouteList = void 0;
// import { Request, Response, NextFunction } from "express";
var assert_1 = require("assert");
var rover_1 = __importDefault(require("./controllers/rover"));
var roverTest = new rover_1.default();
function testGetRouteList() {
    assert_1.strict.deepStrictEqual(roverTest.getRoutesList(), ["mapInfo", "roverInfo", "roverMove"]);
}
exports.testGetRouteList = testGetRouteList;
function testGenerateMap() {
    var map = roverTest.generateMap();
    (0, assert_1.strict)(typeof (map) == 'object');
}
exports.testGenerateMap = testGenerateMap;
function testGenerateObstacles() {
    var obstacles = roverTest.generateObstacles(roverTest.defaultObstacleNumber);
    (0, assert_1.strict)(typeof (obstacles) == 'object');
    assert_1.strict.equal(obstacles.length, roverTest.defaultObstacleNumber);
}
exports.testGenerateObstacles = testGenerateObstacles;
function testGetRandomNumber() {
    var n = roverTest.getRandomNumber(20);
    assert_1.strict.ok(n > 0 && n <= 20);
}
exports.testGetRandomNumber = testGetRandomNumber;
function testGetRandomDirection() {
    var direction = roverTest.getRandomDirection();
    assert_1.strict.ok(typeof (direction) == 'string');
    (0, assert_1.strict)(['N', 'E', 'S', 'W'].find(function (el) { return el.includes(direction); }));
}
exports.testGetRandomDirection = testGetRandomDirection;
