import { Point, cartesianXyGrid, Directions, xyCoords } from "../interfaces/cartesian";
import { DatabaseController } from './database';

export default class MapController { 
    defaultMapLength = 6;
    defaultObstacleNumber = 10;

     // rover, map and ostacle info (use only on resetMap function)
    mapLength: number;
    mapGrid: cartesianXyGrid = [];
    mapGridObstacles: cartesianXyGrid = []; 
    mapObsaclesNumber: number;
    osbtacleFound = false;
    currentPosition: Point;
    currentDirection: Directions;
    futurePosition: Point;

    /** function that can rebuild map, obstacles and rover position
    * in other words: call it and destroy the Mars Planet (the map) and re-build it randomly!
    */
    resetMap(mapLength?, obstacleNumber?) {
        // generate random values (generate map, obstacle on the map and place the rover randomly on the map)
        this.mapLength = mapLength ? mapLength : this.defaultMapLength;
        const mlenth = mapLength ? mapLength : this.defaultMapLength;
        const map = this.generateMap();
        this.mapGrid = [...map];
        const obstacles = obstacleNumber ? this.generateObstacles(obstacleNumber) : this.generateObstacles(this.defaultObstacleNumber);
        this.mapGridObstacles = [...obstacles];
    
        const cpos = this.getRandomMapPosition_obstacleAware();
        const cdir = this.getRandomDirection();
        const fpos = cpos;
    
        let MarsObj = {  // prepare the object for database
          mapLength: this.mapLength,
          mapGrid: map,
          mapGridObstacles: obstacles,
          currentPosition: cpos,
          currentDirection: cdir,
          futurePosition: fpos
        }
        
        DatabaseController.set(MarsObj); // save value to database
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