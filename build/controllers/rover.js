"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import axios, { AxiosResponse } from 'axios';
var express_1 = __importDefault(require("express"));
// interface roverInfo {
//     currentPosition: Point; 
//     futurePosition: Point; 
//     lastCoordChanged: 'x'|'y';  
//     currentDirection: 'N'|'E'|'S'|'W'; 
// }
// interface marsMap {
//     mapLength: number;
//     mapGrid: Array<Object>; // [{ y: number, x: number}, ...}
//     mapGridObstacles: Array<Object>;  // [{ y: number, x: number}, ...}
//     mapObsaclesNumber: number;
// }
var RoverController = /** @class */ (function () {
    // roverInfo: roverInfo;
    // todo: order class by init timing
    function RoverController(mapLength) {
        if (mapLength === void 0) { mapLength = 1; }
        var _this = this;
        this.router = express_1.default.Router();
        this.mapGrid = []; // [{ y: number, x: number}, ...}
        this.mapGridObstacles = []; // [{ y: number, x: number}, ...}
        /** PUBLIC ROUTES */
        // return the rover positon and rirection
        this.getRoverInfo = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, res.status(200).json({
                        position: this.currentPosition,
                        direction: this.currentDirection
                    })];
            });
        }); };
        this.roverMove = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var commands;
            var _this = this;
            return __generator(this, function (_a) {
                commands = req.query.commands.split(',');
                commands.forEach(function (c, index) {
                    // calculate the future spatial position of the rover
                    // if the rover go out the limit of the map we execute the map function
                    // todo: not tested with large map 3,6....
                    _this.setFuturePosition(c);
                    // console.log('rover future position ->', this.futurePosition);
                    // check obstacles. If any block script; else move che rover and continue the loop.
                    if (_this.isThereObstacles()) {
                        return res.status(200).json({
                            message: 'Obstacle found! We move the rover untile the last free position.',
                            currentPosition: _this.currentPosition,
                            obstaclePosition: _this.futurePosition,
                            mapGridObstacles: _this.mapGridObstacles
                        });
                        // @todo: interrompere la sequenza e restare in ascolto di nuovi comandi
                    }
                    else {
                        // no obstacle found, update the futurePosition
                        _this.currentPosition = _this.futurePosition;
                        // console.log('no obstacle. change position. The new position of the Rover is:');
                        // console.log(this.currentPosition);
                        // if we are at the end of commands we return rover info
                        return res.status(200).json({
                            message: 'We correcly move the rover! No obstacle found.',
                            currentPosition: _this.currentPosition,
                            currentDirection: _this.currentDirection,
                            mapGridObstacles: _this.mapGridObstacles,
                        });
                    }
                });
                return [2 /*return*/];
            });
        }); };
        this.initializeRoutes();
        this.mapLength = mapLength; // set the map length
        this.generateMap(); // generate the map based on map length
        this.generateObstacles(); // generate some random obstacles in the map
        this.initRoverPosition(); // generate a random rover position and direction (N,E,S,W)
        console.log('init complete (map, obstacles & rover position).');
    }
    RoverController.prototype.initializeRoutes = function () {
        this.router.get('/roverInfo', this.getRoverInfo);
        this.router.post('/roverMove', this.roverMove);
    };
    RoverController.prototype.isThereObstacles = function () {
        var _this = this;
        var collision = function (obstacle) { return obstacle.y === _this.futurePosition.y && obstacle.x === _this.futurePosition.x; };
        if (this.mapGridObstacles.some(collision)) {
            // abbiamo incontrato un ostacolo (muovere il rover fino a li e stampare la posizione dell'ostacolo)
            return true;
        }
        else {
            return false; // no obstacle found in the futurePosition
        }
    };
    RoverController.prototype.setFuturePosition = function (command) {
        this.futurePosition = this.currentPosition;
        // a seconda del tipo di comando chiamo la funzione corrispondente
        switch (command) {
            case 'f': this.moveForward();
            case 'b': this.moveBackward();
            case 'r': this.moveRight();
            case 'l': this.moveLeft();
        }
        // we execute wrapping if needed
        this.wrapping();
    };
    RoverController.prototype.moveForward = function () {
        switch (this.currentDirection) {
            case 'N':
                this.futurePosition.y++;
                this.lastCoordChanged = 'y';
                break;
            case 'E':
                this.futurePosition.x++;
                this.lastCoordChanged = 'x';
                break;
            case 'S':
                this.futurePosition.y--;
                this.lastCoordChanged = 'y';
                break;
            case 'W':
                this.futurePosition.x--;
                this.lastCoordChanged = 'x';
                break;
        }
    };
    RoverController.prototype.moveBackward = function () {
        switch (this.currentDirection) {
            case 'N':
                this.futurePosition.y--;
                this.lastCoordChanged = 'y';
                break;
            case 'E':
                this.futurePosition.x--;
                this.lastCoordChanged = 'x';
                break;
            case 'S':
                this.futurePosition.y++;
                this.lastCoordChanged = 'y';
                break;
            case 'W':
                this.futurePosition.x++;
                this.lastCoordChanged = 'x';
                break;
        }
    };
    RoverController.prototype.moveRight = function () {
        switch (this.currentDirection) {
            case 'N':
                this.futurePosition.x++;
                this.lastCoordChanged = 'x';
                break;
            case 'E':
                this.futurePosition.y--;
                this.lastCoordChanged = 'y';
                break;
            case 'S':
                this.futurePosition.x--;
                this.lastCoordChanged = 'x';
                break;
            case 'W':
                this.futurePosition.y++;
                this.lastCoordChanged = 'y';
                break;
        }
    };
    RoverController.prototype.moveLeft = function () {
        switch (this.currentDirection) {
            case 'N':
                this.futurePosition.x--;
                this.lastCoordChanged = 'x';
                break;
            case 'E':
                this.futurePosition.y++;
                this.lastCoordChanged = 'y';
                break;
            case 'S':
                this.futurePosition.x++;
                this.lastCoordChanged = 'x';
                break;
            case 'W':
                this.futurePosition.y--;
                this.lastCoordChanged = 'y';
                break;
        }
    };
    // check if we are outside of the map. If yes we execute the wrapping; if not we do nothing.
    RoverController.prototype.wrapping = function () {
        if (this.coordIsOutOfMap()) {
            this.executePositionWrapping();
        }
    };
    // check if the future position modified coord (x or y) is out of map boundaries.
    // if the x or y is < 0 of > this.mapLength we are out of the map...
    // lastCoordChanged is the coordinate (x or y) that is just changed by the move function
    RoverController.prototype.coordIsOutOfMap = function () {
        if (this.futurePosition[this.lastCoordChanged] < 0 || this.futurePosition[this.lastCoordChanged] > this.mapLength) {
            return true; // the current coord is outside the map, so return true to make a position wrapping 
        }
        else {
            return false;
        }
    };
    // function that execute the rover position wrapping when the rover go outside of the map
    RoverController.prototype.executePositionWrapping = function () {
        if (this.futurePosition[this.lastCoordChanged] < 0) {
            // if the rover coord position is out map and is < 0 we move the rover to the opposite (x|y = mapLength)
            this.futurePosition[this.lastCoordChanged] = this.mapLength;
        }
        else if (this.futurePosition[this.lastCoordChanged] > this.mapLength) {
            // if the rover coord position is out map and is > of this.mapLength we move the rover to the opposite (x|y = 0)
            this.futurePosition[this.lastCoordChanged] = 0;
        }
    };
    RoverController.prototype.generateObstacles = function (obstacles) {
        if (obstacles === void 0) { obstacles = 2; }
        var mapGridObstacles = [];
        var _loop_1 = function () {
            var r_1 = this_1.getRandomMapPosition(); // it's an obj like {y:1, x:2}
            if (!mapGridObstacles.some(function (element) { return element == r_1; })) { // todo: make method?
                // l'ostacolo non è già presente alla lista, lo aggiungo.
                mapGridObstacles.push(r_1); // obstacle not found, i cana add it safely
            }
        };
        var this_1 = this;
        // generate obstacles until we reach the obstaclesNumber
        while (mapGridObstacles.length < obstacles) {
            _loop_1();
        }
        this.mapGridObstacles = mapGridObstacles;
        console.log('obstacles position:', this.mapGridObstacles);
    };
    RoverController.prototype.getRandomMapPosition = function () {
        // todo: check if right the random -1!!
        var randomIndex = this.getRandomNumber(this.mapGrid.length - 1); // get a random index
        var randomMapPosition = this.mapGrid[randomIndex];
        return randomMapPosition;
    };
    RoverController.prototype.getRandomMapPosition_obstacleAware = function () {
        var pass = false;
        var _loop_2 = function () {
            var r_2 = this_2.getRandomMapPosition(); // like 
            // check if the random position collides with an obstacle, if not we keep it.
            // todo: this is orrible
            if (!this_2.mapGridObstacles.some(function (element) { return element == r_2; })) {
                pass = true;
                return { value: r_2 };
            }
        };
        var this_2 = this;
        while (!pass) {
            var state_1 = _loop_2();
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    // todo: improve comment and fix mapGrid type in class declaration
    RoverController.prototype.generateMap = function () {
        for (var i = 0; i <= this.mapLength; i++) {
            this.mapGrid.push({ y: 0, x: i }); // generate the first x row of the map like {y:0, x:0}...
            // generate all the y layer based on the first x row of the map like {y:1, x:0}...
            for (var inner = 1; inner <= this.mapLength; inner++) {
                this.mapGrid.push({ y: inner, x: i });
            }
        }
        console.log('map', this.mapGrid);
    };
    RoverController.prototype.initRoverPosition = function () {
        this.currentPosition = this.getRandomMapPosition_obstacleAware();
        this.currentDirection = this.getRandomDirection();
        console.log('rover position and direction:', this.currentPosition, this.currentDirection);
    };
    RoverController.prototype.getRandomNumber = function (max) {
        return Math.floor(Math.random() * (max + 1));
    };
    RoverController.prototype.getRandomDirection = function () {
        var directions = ['N', 'E', 'S', 'W']; // all the possibile rover directions
        var r = this.getRandomNumber(directions.length - 1); // get a random number between 0 and direction.length (0-3)
        return directions[r]; // return a random direction
    };
    return RoverController;
}());
exports.default = RoverController;
var r = new RoverController();
console.log('init obj instance');
/*

TODO TECNICI
- test del codice (funziona move?)
- api
- refractoring

TODO STILE
 - let vs const ??!?
 - use interfaces, class... getter and setter
 - smart order the property and methods of the class
 - the method name and property are consistent?
 - check comment: simple and clear (see also comment best practices)
 - check the Simple Responsibility Principle and DRY (dont repeat yourself!) ... SOLID ??? Unix philosophy.....
 - implement test (CI / CD)

 PER L'INTERVISTA
 - il codice non è ottimizzato per un pianeta grande. Lo script è fine a se stesso.
*/
