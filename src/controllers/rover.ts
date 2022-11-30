import { Request, Response, NextFunction } from "express";
import express from "express";
import { Point, cartesianXyGrid, Directions, xyCoords } from "../interfaces/cartesian";
import { DatabaseController } from './database';


/**
 * The main class that controll the Rover on Mars Planet.
 * The main function is roverMove() function, and is used to move the rover on mars planet. It's accept [f,b,l,r] string commnand.
 * 
 * On the class start-up the costructor build the: MAP GRID, THE OBSTACLES AND THE INITIAL ROVER POSITION.
 * List of av ailable front-end routes: ["mapInfo", "roverInfo", "roverMove"]
 */

export default class RoverController {
  router = express.Router();
  io:any; // referece to socket.io server instance (used to fire map event to client)

  lastCoordChanged: xyCoords; // used for position wrapping
  osbtacleFound = false;

  dbData: any; // obj retrived from json db file (contain all map and rover info)

  constructor(io) {
    this.io = io;
    this.initializeRoutes(); // init frontend routes
  }

  initializeRoutes() {
    // todo: in the next API redesign we need to follow a pattern, this is a little bit not organized,
    // but this program is very little, so this will not couse big problem
    this.router.get("/roverInfo", this.getRoverInfo);    
    this.router.get("/roverMove", this.roverMoveView);
    this.router.post("/roverMove", this.roverMove);

    // json only api endpoint
    this.router.get("/routeListJson", this.getRoutesList_detailedJson);
    this.router.get("/mapInfo", this.getMapInfo);
  }

  getRoutesList() {
    return ["mapInfo", "roverInfo", "roverMove"];
  }

  // get all the API endpoint
  getRoutesList_detailedJson = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json([
      {
        path: '/routeListJson',
        type: 'get',
        description: 'Return an array of objects of all avaiable API endpoint. [{path: string, type: string, description: string}]'
      },
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
      },
    ]);
  };

  // simply return some map info
  getMapInfo = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json(DatabaseController.getAll());
  };

  // return the rover positon and direction
  getRoverInfo = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render("roverInfo", {
      obstaclePosition: false,
      dbData: DatabaseController.getAll() // retrive all map&rover info from json db
    });
  };

  // return some info to build the roverMoveView in the front-end
  roverMoveView = async (req: Request, res: Response, next: NextFunction) => {
    let dbData:any = DatabaseController.getAll(); // retrive all map&rover info from json db

    res.status(200).render("roverMove", {
      obstaclePosition: false,
      dbData,
      message: `The rover position is: x:${dbData.currentPosition.x}, y:${dbData.currentPosition.y}, directed to ${dbData.currentDirection}. <br> Insert commands above to move the rover.`
    });    
  };

  // check if commands are formatted correctly, is so return true. if not return false to make an error
  checkCommands(commands) {
    let c = commands.split(',');
    let valid = true;

    for(let i=0; i<c.length; i++) {
      let el = c[i];

      if(el && typeof el == 'string' && (el == 'f' || el == 'b' || el == 'r' || el == 'l')) {
        // command is valid
      } else {
        valid = false;
      }
    }

    return (valid) ? true : false;
  }

  // function that move the rover, check obstacles, report success/error
  roverMove = async (req: Request, res: Response, next: NextFunction) => {
    let commands = req.body.commands;
    let responseFormat = (req.body.format == 'json') ? 'json' : false;

    // check if command exist and if correct
    if(commands && this.checkCommands(commands)) {
      commands = req.body.commands.split(',') as ("f" | "b" | "r" | "l")[];
      this.dbData = DatabaseController.getAll(); // retrive all map&rover info from json db

      // execute function for every command send to api
      for (let index = 0; index < commands.length; ++index) {
        this.setFuturePosition(commands[index], res);
        this.checkObstacles();

        if (this.osbtacleFound) {
          break; // path not free. Exit from for loop to block other commands.
        } else {
            this.roverMove_exec(); // Path is free: so update db and move rover.
          }
      }

        this.returnMoveMessage(res, responseFormat); // after exec commands we return a message (or error message)
    } else {
      this.returnRoverCommandError(commands, res);
    }
  }

  // edit the current position on db
  private roverMove_exec() {
    this.dbData.currentPosition = {...this.dbData.futurePosition};

    DatabaseController.set({
      currentPosition: this.dbData.currentPosition
    });
  }

  // return movement failture or success
  private returnMoveMessage(res: Response, responseFormat) {
    console.log('update-map socket event');
    this.io.emit('update-map', this.dbData.currentPosition); // sending socket to update map on clients

      if (this.osbtacleFound) 
          this.returnMoveObstacle(res, responseFormat);
      else 
        this.returnMoveSuccess(res, responseFormat);
  }

  returnRoverCommandError(command, res: Response) {
    if(command) {
      return res.status(400).json({
        yourCommand: command,
        message: 'Commands string is not valid. Command have to be a string divided by a commas like "f,f,b,r"'
      });
    } else {
      return res.status(400).json({
        yourCommand: command,
        message: 'Commands string is undefined. Command have to be a string divided by a commas like "f,f,b,r"'
      });
    }

  }

  // return a errore message with the obstacle position.
  returnMoveObstacle(res, responseFormat: string|boolean) {
    const dbData = DatabaseController.getAll(); // retrive all map&rover info from json db

    if(responseFormat == 'json') {
      return res.status(200).json({
        message: `Obstacle found at position x:${this.dbData.futurePosition.x}, y:${this.dbData.futurePosition.y}`,
        roverPosition: this.dbData.currentPosition,
        roverDirection: this.dbData.currentDirection,
  
        mapGrid: this.dbData.mapGrid,
        mapGridObstacles: this.dbData.mapGridObstacles,
        mapLength: this.dbData.mapLength,
      });
    } else {
        res.status(200).render("roverMove", {
          obstaclePosition: false,
          dbData,
          message: `Obstacle found at position x:${this.dbData.futurePosition.x}, y:${this.dbData.futurePosition.y}`,
        }); 
    }
  }

  // return a succes message. The move was moved with no obstacle in the path
  returnMoveSuccess(res, responseFormat:string|boolean) {
    const dbData = DatabaseController.getAll(); // retrive all map&rover info from json db

    if(responseFormat == 'json') {
      return res.status(200).json({
        message: "Rover moved. No ostacle found in the commands path.",
        roverPosition: this.dbData.currentPosition,
        roverDirection: this.dbData.currentDirection,
        obstaclePosition: false,
  
        mapGrid: this.dbData.mapGrid,
        mapGridObstacles: this.dbData.mapGridObstacles,
        mapLength: this.dbData.mapLength,
      });
    } else {
      //// do nothing beause the .exj view is update by update-map event
      res.status(200).render("roverMove", {
        obstaclePosition: false,
        dbData,
        message: "Rover moved. No ostacle found in the commands path.",
      }); 
    }
  }

  // function that check (before to move the rover),
  // if the futurePosition of the rover is an obstacle.
  checkObstacles(): boolean {
    let collision = (obstacle: Point) =>
      obstacle.x === this.dbData.futurePosition.x &&
      obstacle.y === this.dbData.futurePosition.y;
    if (this.dbData.mapGridObstacles.some(collision)) {
      this.osbtacleFound = true;
      return true;
    } else {
      this.osbtacleFound = false;
      return false; 
    }
  }

  setFuturePosition(command: string, res: Response) {   
    this.dbData.futurePosition = {...this.dbData.currentPosition}

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
        this.returnRoverCommandError(command, res);
        break;
    }

    // we execute wrapping, if needed
    this.wrapping();
  }

  // 4 set of functions to move the rover on the map (directions aware)
  moveForward() {
    switch (this.dbData.currentDirection) {
      case "N":
        this.dbData.futurePosition.y++;
        this.lastCoordChanged = "y";
        break;
      case "E":
        this.dbData.futurePosition.x++;
        this.lastCoordChanged = "x";
        break;
      case "S":
        this.dbData.futurePosition.y--;
        this.lastCoordChanged = "y";
        break;
      case "W":
        this.dbData.futurePosition.x--;
        this.lastCoordChanged = "x";
        break;
    }
  }

  // 4 set of functions to move the rover on the map (directions aware)
  moveBackward() {
    switch (this.dbData.currentDirection) {
      case "N":
        this.dbData.futurePosition.y--;
        this.lastCoordChanged = "y";
        break;
      case "E":
        this.dbData.futurePosition.x--;
        this.lastCoordChanged = "x";
        break;
      case "S":
        this.dbData.futurePosition.y++;
        this.lastCoordChanged = "y";
        break;
      case "W":
        this.dbData.futurePosition.x++;
        this.lastCoordChanged = "x";
        break;
    }
  }

  // 4 set of functions to move the rover on the map (directions aware)
  moveRight() {
    switch (this.dbData.currentDirection) {
      case "N":
        this.dbData.futurePosition.x++;
        this.lastCoordChanged = "x";
        break;
      case "E":
        this.dbData.futurePosition.y--;
        this.lastCoordChanged = "y";
        break;
      case "S":
        this.dbData.futurePosition.x--;
        this.lastCoordChanged = "x";
        break;
      case "W":
        this.dbData.futurePosition.y++;
        this.lastCoordChanged = "y";
        break;
    }
  }

  // 4 set of functions to move the rover on the map (directions aware)
  moveLeft() {
    switch (this.dbData.currentDirection) {
      case "N":
        this.dbData.futurePosition.x--;
        this.lastCoordChanged = "x";
        break;
      case "E":
        this.dbData.futurePosition.y++;
        this.lastCoordChanged = "y";
        break;
      case "S":
        this.dbData.futurePosition.x++;
        this.lastCoordChanged = "x";
        break;
      case "W":
        this.dbData.futurePosition.y--;
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
      this.dbData.futurePosition[this.lastCoordChanged] < 0 ||
      this.dbData.futurePosition[this.lastCoordChanged] > this.dbData.mapLength
    )
      return true; // the current coord is outside the map, so return true to make a position wrapping
    else
      return false;

  }

  // function that execute the rover position wrapping when the rover go outside of the map
  executePositionWrapping(): void {
    if (this.dbData.futurePosition[this.lastCoordChanged] < 0) {
      // if the rover coord position is out map and is < 0 we move the rover to the opposite (x|y = mapLength)
      this.dbData.futurePosition[this.lastCoordChanged] = this.dbData.mapLength;
    } else if (this.dbData.futurePosition[this.lastCoordChanged] > this.dbData.mapLength) {
      // if the rover coord position is out map and is > of this.mapLength we move the rover to the opposite (x|y = 0)
      this.dbData.futurePosition[this.lastCoordChanged] = 0;
    }
  }
}