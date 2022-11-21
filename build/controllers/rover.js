"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var express_1 = __importDefault(require("express"));
/**
 * The main class that controll the Rover on Mars Planet.
 * The main function is roverMove() function, and is used to move the rover on mars planet. It's accept [f,b,l,r] string commnand.
 *
 * On the class start-up the costructor build the: MAP GRID, THE OBSTACLES AND THE INITIAL ROVER POSITION.
 * List of available front-end routes: ["mapInfo", "roverInfo", "roverMove"]
 */
var RoverController = /** @class */ (function () {
    function RoverController(mapLength, obstacleNumber) {
        var _this = this;
        this.router = express_1.default.Router();
        this.mapGrid = [];
        this.mapGridObstacles = [];
        this.osbtacleFound = false;
        this.defaultMapLength = 6;
        this.defaultObstacleNumber = 10;
        // get all the API endpoint
        this.getRoutesList_detailedJson = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, res.status(200).json([
                        {
                            path: '/mapInfo',
                            type: 'get',
                            description: 'Simply return map all map info (mapLength, mapGrid, mapGridObstacles)'
                        },
                        {
                            path: '/roverInfo',
                            type: 'get',
                            description: 'Simply return the rover position (currentPosition, currentDirection) and also all the map info.'
                        },
                        {
                            path: '/roverMove',
                            type: 'post',
                            description: 'Accept an array of [f,b,r,l] letters and move the rover on the map. Return new rover position or an obstacle if found'
                        }
                    ])];
            });
        }); };
        // simply return some map info
        this.getMapInfo = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, res.status(200).json({
                        mapLength: this.mapLength,
                        mapGrid: this.mapGrid,
                        mapGridObstacles: this.mapGridObstacles,
                        roverPosition: this.currentPosition,
                        roverDirection: this.currentDirection,
                    })];
            });
        }); };
        // return the rover positon and direction
        this.getRoverInfo = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, res.status(200).render("roverInfo", {
                        position: this.currentPosition,
                        direction: this.currentDirection,
                        mapLength: this.mapLength,
                        mapGrid: this.mapGrid,
                        mapGridObstacles: this.mapGridObstacles,
                        roverPosition: this.currentPosition,
                        roverDirection: this.currentDirection,
                    })];
            });
        }); };
        // return some info to build the roverMoveView in the front-end
        this.roverMoveView = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, res.status(200).render("roverMove", {
                        roverPosition: this.currentPosition,
                        roverDirection: this.currentDirection,
                        obstaclePosition: false,
                        mapGrid: this.mapGrid,
                        mapGridObstacles: this.mapGridObstacles,
                        mapLength: this.mapLength,
                        message: "The rover position is: x:".concat(this.currentPosition.x, ", y:").concat(this.currentPosition.y, ", directed to ").concat(this.currentDirection, ". <br> Insert commands above to move the rover.")
                    })];
            });
        }); };
        // function responsable to move the rover, check obstacles, report success/error
        this.roverMove = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var commands, index;
            return __generator(this, function (_a) {
                commands = req.body.commands.split(',');
                for (index = 0; index < commands.length; ++index) {
                    this.setFuturePosition(commands[index]);
                    this.checkObstacles();
                    if (this.osbtacleFound)
                        break;
                    else
                        this.currentPosition = this.futurePosition;
                }
                if (this.osbtacleFound)
                    this.returnMoveObstacle(res);
                else
                    this.returnMoveSuccess(res);
                return [2 /*return*/];
            });
        }); };
        this.initializeRoutes(); // init front-end routes
        this.mapLength = mapLength ? mapLength : this.defaultMapLength; // set the map length
        this.mapGrid = this.generateMap(); // generate the map based on map length
        this.mapGridObstacles = obstacleNumber ? this.generateObstacles(obstacleNumber) : this.generateObstacles(this.defaultObstacleNumber); // generate some random obstacles in the map
        this.initRoverPosition(); // generate a random rover position and direction (N,E,S,W)
    }
    RoverController.prototype.initializeRoutes = function () {
        // todo: in the next API redesign we need to follow a pattern, this is a little bit not organized,
        // but this program is very little, so this will not couse big problem
        this.router.get("/roverInfo", this.getRoverInfo);
        this.router.get("/roverMove", this.roverMoveView);
        this.router.post("/roverMove", this.roverMove);
        // json only api endpoint
        this.router.get("/routeListJson", this.getRoutesList_detailedJson);
        this.router.get("/mapInfo", this.getMapInfo);
    };
    RoverController.prototype.getRoutesList = function () {
        return ["mapInfo", "roverInfo", "roverMove"];
    };
    // return a errore message with the obstacle position.
    RoverController.prototype.returnMoveObstacle = function (res) {
        return res.status(200).render("roverMove", {
            message: "Obstacle found at position x:".concat(this.futurePosition.x, ", y:").concat(this.futurePosition.y),
            roverPosition: this.currentPosition,
            roverDirection: this.currentDirection,
            mapGrid: this.mapGrid,
            mapGridObstacles: this.mapGridObstacles,
            mapLength: this.mapLength,
        });
    };
    // return a succes message. The move was moved with no obstacle in the path
    RoverController.prototype.returnMoveSuccess = function (res) {
        return res.status(200).render("roverMove", {
            message: "Rover moved. No ostacle found in the commands path.",
            roverPosition: this.currentPosition,
            roverDirection: this.currentDirection,
            obstaclePosition: false,
            mapGrid: this.mapGrid,
            mapGridObstacles: this.mapGridObstacles,
            mapLength: this.mapLength,
        });
    };
    // function that check (before to move the rover),
    // if the futurePosition of the rover is an obstacle.
    RoverController.prototype.checkObstacles = function () {
        var _this = this;
        var collision = function (obstacle) {
            return obstacle.x === _this.futurePosition.x &&
                obstacle.y === _this.futurePosition.y;
        };
        if (this.mapGridObstacles.some(collision)) {
            this.osbtacleFound = true;
            return true;
        }
        else {
            this.osbtacleFound = false;
            return false;
        }
    };
    RoverController.prototype.setFuturePosition = function (command) {
        this.futurePosition = __assign({}, this.currentPosition);
        // call the corret move function depending on current command
        switch (command) {
            case "f":
                this.moveForward();
                break;
            case "b":
                this.moveBackward();
                break;
            case "r":
                this.moveRight();
                break;
            case "l":
                this.moveLeft();
                break;
            default:
                this.wrongCommand();
                break;
        }
        // we execute wrapping, if needed
        this.wrapping();
    };
    RoverController.prototype.wrongCommand = function () {
        console.log('command it\'s not valid');
    };
    // 4 set of functions to move the rover on the map (directions aware)
    RoverController.prototype.moveForward = function () {
        switch (this.currentDirection) {
            case "N":
                this.futurePosition.y++;
                this.lastCoordChanged = "y";
                break;
            case "E":
                this.futurePosition.x++;
                this.lastCoordChanged = "x";
                break;
            case "S":
                this.futurePosition.y--;
                this.lastCoordChanged = "y";
                break;
            case "W":
                this.futurePosition.x--;
                this.lastCoordChanged = "x";
                break;
        }
    };
    // 4 set of functions to move the rover on the map (directions aware)
    RoverController.prototype.moveBackward = function () {
        switch (this.currentDirection) {
            case "N":
                this.futurePosition.y--;
                this.lastCoordChanged = "y";
                break;
            case "E":
                this.futurePosition.x--;
                this.lastCoordChanged = "x";
                break;
            case "S":
                this.futurePosition.y++;
                this.lastCoordChanged = "y";
                break;
            case "W":
                this.futurePosition.x++;
                this.lastCoordChanged = "x";
                break;
        }
    };
    // 4 set of functions to move the rover on the map (directions aware)
    RoverController.prototype.moveRight = function () {
        switch (this.currentDirection) {
            case "N":
                this.futurePosition.x++;
                this.lastCoordChanged = "x";
                break;
            case "E":
                this.futurePosition.y--;
                this.lastCoordChanged = "y";
                break;
            case "S":
                this.futurePosition.x--;
                this.lastCoordChanged = "x";
                break;
            case "W":
                this.futurePosition.y++;
                this.lastCoordChanged = "y";
                break;
        }
    };
    // 4 set of functions to move the rover on the map (directions aware)
    RoverController.prototype.moveLeft = function () {
        switch (this.currentDirection) {
            case "N":
                this.futurePosition.x--;
                this.lastCoordChanged = "x";
                break;
            case "E":
                this.futurePosition.y++;
                this.lastCoordChanged = "y";
                break;
            case "S":
                this.futurePosition.x++;
                this.lastCoordChanged = "x";
                break;
            case "W":
                this.futurePosition.y--;
                this.lastCoordChanged = "y";
                break;
        }
    };
    // check if we are outside of the map. If yes we execute the wrapping; if not we do nothing.
    RoverController.prototype.wrapping = function () {
        if (this.coordIsOutOfMap())
            this.executePositionWrapping();
    };
    // check if the future position modified coord (x or y) is out of map boundaries.
    // if the x or y is < 0 of > this.mapLength we are out of the map...
    // lastCoordChanged is the coordinate (x or y) that is just changed by the move function
    RoverController.prototype.coordIsOutOfMap = function () {
        if (this.futurePosition[this.lastCoordChanged] < 0 ||
            this.futurePosition[this.lastCoordChanged] > this.mapLength)
            return true; // the current coord is outside the map, so return true to make a position wrapping
        else
            return false;
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
    // generate n. of obstacles in the map
    RoverController.prototype.generateObstacles = function (obstacles) {
        var mapGridObstacles = [];
        var _loop_1 = function () {
            var randomPositionObj = this_1.getRandomMapPosition();
            if (!mapGridObstacles.some(function (OstacleObj) { return JSON.stringify(OstacleObj) === JSON.stringify(randomPositionObj); })) {
                mapGridObstacles.push(randomPositionObj); // obstacle not present in the list, we add it
            }
        };
        var this_1 = this;
        // generate obstacles until we reach the obstaclesNumber
        while (mapGridObstacles.length < obstacles) {
            _loop_1();
        }
        return mapGridObstacles;
    };
    // return a random map position like {y:1, x:2}
    RoverController.prototype.getRandomMapPosition = function () {
        var randomIndex = this.getRandomNumber(this.mapGrid.length - 1); // get a random index
        return __assign({}, this.mapGrid[randomIndex]); // return the random map position with no reference
    };
    // return a random map position like {y:1, x:2} without obstacle
    RoverController.prototype.getRandomMapPosition_obstacleAware = function () {
        var pass = false;
        var _loop_2 = function () {
            var randomPositionObj = this_2.getRandomMapPosition();
            // check if the random position collides with an obstacle, if not we keep it.
            if (!this_2.mapGridObstacles.some(function (OstacleObj) { return JSON.stringify(OstacleObj) === JSON.stringify(randomPositionObj); })) {
                pass = true;
                return { value: randomPositionObj };
            }
        };
        var this_2 = this;
        while (!pass) {
            var state_1 = _loop_2();
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    // generate the mars cartesian bidimensional map like: [{x:0, y:0}, {x:1, y:0}, ...]
    RoverController.prototype.generateMap = function () {
        var mapGrid = [];
        for (var i = 0; i <= this.mapLength; i++) {
            mapGrid.push({ x: 0, y: i }); // generate the first x row of the map like {y:0, x:0}...
            // generate all the y layer based on the first x row of the map like {y:1, x:0}...
            for (var inner = 1; inner <= this.mapLength; inner++) {
                mapGrid.push({ x: inner, y: i });
            }
        }
        return mapGrid;
    };
    // initialize a rover random map position and direction
    RoverController.prototype.initRoverPosition = function () {
        this.currentPosition = this.getRandomMapPosition_obstacleAware();
        this.currentDirection = this.getRandomDirection();
    };
    // return a random between 0 and max
    RoverController.prototype.getRandomNumber = function (max) {
        return Math.floor(Math.random() * (max + 1));
    };
    // return a random map direction
    RoverController.prototype.getRandomDirection = function () {
        var directions = ["N", "E", "S", "W"]; // all the possibile rover directions
        var r = this.getRandomNumber(directions.length - 1); // get a random number between 0 and direction.length (0-3)
        return directions[r];
    };
    return RoverController;
}());
exports.default = RoverController;
