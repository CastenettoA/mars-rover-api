import { Request, Response, NextFunction } from "express";
import express from "express";
import { Point, cartesianXyGrid, Directions, xyCoords } from "../interfaces/cartesian";


/**
 * The main class that controll the Rover on Mars Planet.
 * The main function is roverMove() function, and is used to move the rover on mars planet. It's accept [f,b,l,r] string commnand.
 * 
 * On the class start-up the costructor build the: MAP GRID, THE OBSTACLES AND THE INITIAL ROVER POSITION.
 * List of available front-end routes: ["mapInfo", "roverInfo", "roverMove"]
 */
export default class RoverController {
  router = express.Router();


  mapLength: number;
  mapGrid: cartesianXyGrid = [];
  mapGridObstacles: cartesianXyGrid = []; 
  mapObsaclesNumber: number;
  osbtacleFound = false;

  defaultMapLength = 6;
  defaultObstacleNumber = 10;

  currentPosition: Point;
  futurePosition: Point;
  lastCoordChanged: xyCoords;
  currentDirection: Directions;

  constructor(mapLength?, obstacleNumber?) {
    this.initializeRoutes(); // init front-end routes
    this.mapLength = mapLength ? mapLength : this.defaultMapLength; // set the map length
    this.mapGrid = this.generateMap(); // generate the map based on map length
    this.mapGridObstacles = obstacleNumber ? this.generateObstacles(obstacleNumber) : this.generateObstacles(this.defaultObstacleNumber); // generate some random obstacles in the map
    this.initRoverPosition(); // generate a random rover position and direction (N,E,S,W)
  }

  initializeRoutes() {
    this.router.get("/mapInfo", this.getMapInfo);
    this.router.get("/roverInfo", this.getRoverInfo);
    this.router.get("/roverMove", this.roverMoveView);
    this.router.post("/roverMove", this.roverMove);
  }

  getRoutesList() {
    return ["mapInfo", "roverInfo", "roverMove"];
  }

  // simply return some map info
  getMapInfo = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      mapLength: this.mapLength,
      mapGrid: this.mapGrid,
      mapGridObstacles: this.mapGridObstacles,
      roverPosition: this.currentPosition,
      roverDirection: this.currentDirection,
    });
  };

  // return the rover positon and direction
  getRoverInfo = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).render("roverInfo", {
      position: this.currentPosition,
      direction: this.currentDirection,

      mapLength: this.mapLength,
      mapGrid: this.mapGrid,
      mapGridObstacles: this.mapGridObstacles,
      roverPosition: this.currentPosition,
      roverDirection: this.currentDirection,
    });
  };

  // return some info to build the roverMoveView in the front-end
  roverMoveView = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).render("roverMove", {
      roverPosition: this.currentPosition,
      roverDirection: this.currentDirection,
      obstaclePosition: false,

      mapGrid: this.mapGrid,
      mapGridObstacles: this.mapGridObstacles,
      mapLength: this.mapLength,
      message: `The rover position is: x:${this.currentPosition.x}, y:${this.currentPosition.y}, directed to ${this.currentDirection}. <br> Insert commands above to move the rover.`
    });
  };

  // function responsable to move the rover, check obstacles, report success/error
  roverMove = async (req: Request, res: Response, next: NextFunction) => {
    let commands = req.body.commands.split(',') as ("f" | "b" | "r" | "l")[];

    for (let index = 0; index < commands.length; ++index) {
      this.setFuturePosition(commands[index]);
      this.checkObstacles();
      if (this.osbtacleFound) break;
      else this.currentPosition = this.futurePosition;
    }

    if (this.osbtacleFound) this.returnMoveObstacle(res);
    else this.returnMoveSuccess(res);
  }

  // return a errore message with the obstacle position.
  returnMoveObstacle(res) {
    return res.status(200).render("roverMove", {
      message: `Obstacle found at position x:${this.futurePosition.x}, y:${this.futurePosition.y}`,
      roverPosition: this.currentPosition,
      roverDirection: this.currentDirection,

      mapGrid: this.mapGrid,
      mapGridObstacles: this.mapGridObstacles,
      mapLength: this.mapLength,
    });
  }

  // return a succes message. The move was moved with no obstacle in the path
  returnMoveSuccess(res) {
    return res.status(200).render("roverMove", {
      message: "Rover moved. No ostacle found in the commands path.",
      roverPosition: this.currentPosition,
      roverDirection: this.currentDirection,
      obstaclePosition: false,

      mapGrid: this.mapGrid,
      mapGridObstacles: this.mapGridObstacles,
      mapLength: this.mapLength,
    });
  }

  // function that check (before to move the rover),
  // if the futurePosition of the rover is an obstacle.
  checkObstacles(): boolean {
    let collision = (obstacle: Point) =>
      obstacle.x === this.futurePosition.x &&
      obstacle.y === this.futurePosition.y;
    if (this.mapGridObstacles.some(collision)) {
      this.osbtacleFound = true;
      return true;
    } else {
      this.osbtacleFound = false;
      return false; 
    }
  }

  setFuturePosition(command: string) {
    this.futurePosition = { ...this.currentPosition }; 

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
  }

  wrongCommand() {
    console.log('command it\'s not valid');
  }

  // 4 set of functions to move the rover on the map (directions aware)
  moveForward() {
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
  }

  // 4 set of functions to move the rover on the map (directions aware)
  moveBackward() {
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
  }

  // 4 set of functions to move the rover on the map (directions aware)
  moveRight() {
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
  }

  // 4 set of functions to move the rover on the map (directions aware)
  moveLeft() {
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
  }

  // check if we are outside of the map. If yes we execute the wrapping; if not we do nothing.
  wrapping() {
    if (this.coordIsOutOfMap())
      this.executePositionWrapping();
  }

  // check if the future position modified coord (x or y) is out of map boundaries.
  // if the x or y is < 0 of > this.mapLength we are out of the map...
  // lastCoordChanged is the coordinate (x or y) that is just changed by the move function
  coordIsOutOfMap(): boolean {
    if (
      this.futurePosition[this.lastCoordChanged] < 0 ||
      this.futurePosition[this.lastCoordChanged] > this.mapLength
    )
      return true; // the current coord is outside the map, so return true to make a position wrapping
    else
      return false;

  }

  // function that execute the rover position wrapping when the rover go outside of the map
  executePositionWrapping(): void {
    if (this.futurePosition[this.lastCoordChanged] < 0) {
      // if the rover coord position is out map and is < 0 we move the rover to the opposite (x|y = mapLength)
      this.futurePosition[this.lastCoordChanged] = this.mapLength;
    } else if (this.futurePosition[this.lastCoordChanged] > this.mapLength) {
      // if the rover coord position is out map and is > of this.mapLength we move the rover to the opposite (x|y = 0)
      this.futurePosition[this.lastCoordChanged] = 0;
    }
  }

  // generate n. of obstacles in the map
  generateObstacles(obstacles): cartesianXyGrid {
    const mapGridObstacles: cartesianXyGrid = [];

    // generate obstacles until we reach the obstaclesNumber
    while (mapGridObstacles.length < obstacles) {
      let randomPositionObj = this.getRandomMapPosition();

      if (!mapGridObstacles.some((OstacleObj) => JSON.stringify(OstacleObj) === JSON.stringify(randomPositionObj))) {
        mapGridObstacles.push(randomPositionObj); // obstacle not present in the list, we add it
      }
    }

    return mapGridObstacles;
  }

  // return a random map position like {y:1, x:2}
  getRandomMapPosition(): Point {
    let randomIndex = this.getRandomNumber(this.mapGrid.length - 1); // get a random index
    return { ...this.mapGrid[randomIndex] } as Point; // return the random map position with no reference
  }

  // return a random map position like {y:1, x:2} without obstacle
  getRandomMapPosition_obstacleAware(): Point {
    let pass = false;
    while (!pass) {
      let randomPositionObj = this.getRandomMapPosition();

      // check if the random position collides with an obstacle, if not we keep it.
      if (!this.mapGridObstacles.some((OstacleObj) => JSON.stringify(OstacleObj) === JSON.stringify(randomPositionObj))) {
        pass = true;
        return randomPositionObj;
      }
    }
  }

    // generate the mars cartesian bidimensional map like: [{x:0, y:0}, {x:1, y:0}, ...]
    generateMap(): cartesianXyGrid {
      let mapGrid:cartesianXyGrid = [];
      for (let i = 0; i <= this.mapLength; i++) {
        mapGrid.push({ x: 0, y: i }); // generate the first x row of the map like {y:0, x:0}...
  
        // generate all the y layer based on the first x row of the map like {y:1, x:0}...
        for (let inner = 1; inner <= this.mapLength; inner++) {
          mapGrid.push({ x: inner, y: i });
        }
      }

      return mapGrid;
    }

  // initialize a rover random map position and direction
  initRoverPosition(): void {
    this.currentPosition = this.getRandomMapPosition_obstacleAware();
    this.currentDirection = this.getRandomDirection();
  }

  // return a random between 0 and max
  getRandomNumber(max): number {
    return Math.floor(Math.random() * (max + 1));
  }

  // return a random map direction
  getRandomDirection(): Directions {
    const directions = ["N", "E", "S", "W"]; // all the possibile rover directions
    const r: number = this.getRandomNumber(directions.length - 1); // get a random number between 0 and direction.length (0-3)
    return directions[r] as Directions;
  }
}