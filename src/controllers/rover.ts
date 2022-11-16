import { Request, Response, NextFunction } from 'express';
// import axios, { AxiosResponse } from 'axios';
import express from 'express';
import { Point } from '../interfaces/point';

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


export default class RoverController {
    router = express.Router();

    mapLength: number;
    mapGrid: Array<Object> = []; // [{ y: number, x: number}, ...}
    mapGridObstacles: Array<Object> = [];  // [{ y: number, x: number}, ...}
    mapObsaclesNumber: number;
    // marsMap: marsMap;

    currentPosition: Point; 
    futurePosition: Point; 
    lastCoordChanged: 'x'|'y';  
    currentDirection: 'N'|'E'|'S'|'W'; 
    // roverInfo: roverInfo;



    // todo: order class by init timing
    constructor(mapLength = 2) {
        this.initializeRoutes();

        console.log('----------- init program ------------')

        this.mapLength = mapLength; // set the map length
        this.generateMap(); // generate the map based on map length
        this.generateObstacles(); // generate some random obstacles in the map
        this.initRoverPosition(); // generate a random rover position and direction (N,E,S,W)
        console.log('init complete (map, obstacles & rover position).');
    }

    initializeRoutes() {
        this.router.get('/roverInfo', this.getRoverInfo);
        this.router.get('/roverMove', this.roverMoveView);
        this.router.post('/roverMove', this.roverMove);

        // this.router.post('/roverMove_real', this.roverMove_real);
    }

    getRoutesList() {
        return [
            'roverInfo',
            'roverMove'
        ]
    }

    /** PUBLIC ROUTES */
    // return the rover positon and rirection
    getRoverInfo = async (req: Request, res: Response, next: NextFunction) => {
        return res.status(200).render('roverInfo', {
            position: this.currentPosition,
            direction: this.currentDirection
        });
    };

    roverMoveView = async (req: Request, res: Response, next: NextFunction) => {
        return res.status(200).render('roverMove', {
            position: this.currentPosition,
            direction: this.currentDirection,
            obstaclePosition: false,
            mapGrid: this.mapGrid,
            mapGridObstacles: this.mapGridObstacles,
            mapLength: this.mapLength,
        });
    };

    roverMove = async (req: Request, res: Response, next: NextFunction) => {
        let commands: ('f'|'b'|'r'|'l')[] = req.body.commands.split(',');
        // todo: need test
        // console.log(req.query, req.body);
        // let commands:string[] = (req.query.commands as string).split(',');
        console.log(commands);

        commands.forEach((c, index) => {
            // calculate the future spatial position of the rover
            // if the rover go out the limit of the map we execute the map function... todo: not tested with large map 3,6....
            this.setFuturePosition(c);
            
            // check obstacles. If any block script; else move che rover and continue the loop.
            if( this.isThereObstacles() ) {
                console.log('ostacolo trovato')
                return res.status(200).render('roverMove', {
                    message: 'Obstacle found! We move the rover untile the last free position.',
                    position: this.currentPosition,
                    direction: this.currentDirection,
                    obstaclePosition: this.futurePosition,
                    mapGrid: this.mapGrid,
                    mapGridObstacles: this.mapGridObstacles,
                    mapLength: this.mapLength,
                });
                // @todo: interrompere la sequenza e restare in ascolto di nuovi comandi
            } else {
                // no obstacle found, update the futurePosition
                this.currentPosition = this.futurePosition; 
                console.log('ostacolo non trovato, muovo...')

                // if we are at the end of commands we return rover info
                return res.status(200).render('roverMove', {
                    message: 'We move the rover. No ostacle found',
                    position: this.currentPosition,
                    direction: this.currentDirection,
                    obstaclePosition: false,
                    mapGrid: this.mapGrid,
                    mapGridObstacles: this.mapGridObstacles,
                    mapLength: this.mapLength,
                });
            }
        });
    };

    isThereObstacles(): boolean {
        let collision = (obstacle: Point) => obstacle.y === this.futurePosition.y && obstacle.x === this.futurePosition.x;
        if( this.mapGridObstacles.some(collision) ) {
            // abbiamo incontrato un ostacolo (muovere il rover fino a li e stampare la posizione dell'ostacolo)
            return true;
        } else {
            return false; // no obstacle found in the futurePosition
        } 
    }

    setFuturePosition(command: string) {
        this.futurePosition = this.currentPosition;

        // a seconda del tipo di comando chiamo la funzione corrispondente
        switch(command) {
            case 'f': this.moveForward();
            case 'b': this.moveBackward();
            case 'r': this.moveRight();
            case 'l': this.moveLeft();
        }

        // we execute wrapping if needed
        this.wrapping();
    }

    moveForward() {
        switch(this.currentDirection) {
            case 'N': this.futurePosition.y++; this.lastCoordChanged = 'y'; break;
            case 'E': this.futurePosition.x++; this.lastCoordChanged = 'x'; break;
            case 'S': this.futurePosition.y--; this.lastCoordChanged = 'y'; break;
            case 'W': this.futurePosition.x--; this.lastCoordChanged = 'x'; break;
        }
    }

    moveBackward() {
        switch(this.currentDirection) {
            case 'N': this.futurePosition.y--; this.lastCoordChanged = 'y'; break;
            case 'E': this.futurePosition.x--; this.lastCoordChanged = 'x'; break;
            case 'S': this.futurePosition.y++; this.lastCoordChanged = 'y'; break;
            case 'W': this.futurePosition.x++; this.lastCoordChanged = 'x'; break;
        }
    }

    moveRight() {
        switch(this.currentDirection) {
            case 'N': this.futurePosition.x++; this.lastCoordChanged = 'x'; break;
            case 'E': this.futurePosition.y--; this.lastCoordChanged = 'y'; break;
            case 'S': this.futurePosition.x--; this.lastCoordChanged = 'x'; break;
            case 'W': this.futurePosition.y++; this.lastCoordChanged = 'y'; break;
        }
    }

    moveLeft() { // TODO
        switch(this.currentDirection) {
            case 'N': this.futurePosition.x--; this.lastCoordChanged = 'x'; break;
            case 'E': this.futurePosition.y++; this.lastCoordChanged = 'y'; break;
            case 'S': this.futurePosition.x++; this.lastCoordChanged = 'x'; break;
            case 'W': this.futurePosition.y--; this.lastCoordChanged = 'y'; break;
        }
    }

    // check if we are outside of the map. If yes we execute the wrapping; if not we do nothing.
    wrapping() {
        if(this.coordIsOutOfMap()) {
            this.executePositionWrapping();
        }
    }  

    // check if the future position modified coord (x or y) is out of map boundaries.
    // if the x or y is < 0 of > this.mapLength we are out of the map...
    // lastCoordChanged is the coordinate (x or y) that is just changed by the move function
    coordIsOutOfMap(): boolean {
        if( this.futurePosition[this.lastCoordChanged] < 0 || this.futurePosition[this.lastCoordChanged] > this.mapLength ) {
            return true; // the current coord is outside the map, so return true to make a position wrapping 
        } else {
            return false;
        }
    }

    // function that execute the rover position wrapping when the rover go outside of the map
    executePositionWrapping() {
        if(this.futurePosition[this.lastCoordChanged] < 0){ 
            // if the rover coord position is out map and is < 0 we move the rover to the opposite (x|y = mapLength)
            this.futurePosition[this.lastCoordChanged] = this.mapLength; 
        }
        else if(this.futurePosition[this.lastCoordChanged] > this.mapLength){
            // if the rover coord position is out map and is > of this.mapLength we move the rover to the opposite (x|y = 0)
            this.futurePosition[this.lastCoordChanged] = 0; 
        }
    }

    generateObstacles(obstacles = 2) { // generate a number of obstacles in the map
        const mapGridObstacles:any = [];

        // generate obstacles until we reach the obstaclesNumber
        while( mapGridObstacles.length < obstacles ) {

            let r = this.getRandomMapPosition(); // it's an obj like {y:1, x:2}

            if( ! mapGridObstacles.some(element => element == r) ) { // todo: make method?
                // l'ostacolo non è già presente alla lista, lo aggiungo.
                mapGridObstacles.push(r); // obstacle not found, i cana add it safely
            }
        }

        this.mapGridObstacles = mapGridObstacles;
        console.log('obstacles position:', this.mapGridObstacles);
    }

    getRandomMapPosition(): any { // return a random map position like {y:1, x:2}
        // todo: check if right the random -1!!
        let randomIndex = this.getRandomNumber(this.mapGrid.length-1); // get a random index
        let randomMapPosition = this.mapGrid[randomIndex];
        return randomMapPosition;
    }

    getRandomMapPosition_obstacleAware(): any { // return a random map position like {y:1, x:2} that is not an obstacle
        let pass = false;
        
        while( !pass ) {
            let r = this.getRandomMapPosition(); // like 

            // check if the random position collides with an obstacle, if not we keep it.
            // todo: this is orrible
            if( ! this.mapGridObstacles.some(element => element == r) ) {
                pass = true;
                return r;
            }
        }
    }

    // todo: improve comment and fix mapGrid type in class declaration
    generateMap() { // generate cartesian map like: [{y:0, x:0}, {y:1, x:0}, ...]
        for(let i=0; i<=this.mapLength; i++) {
            this.mapGrid.push({y:0, x:i}); // generate the first x row of the map like {y:0, x:0}...

            // generate all the y layer based on the first x row of the map like {y:1, x:0}...
            for(let inner=1; inner<=this.mapLength; inner++) {
                this.mapGrid.push({y:inner, x:i});
            }
        }

        console.log('map', this.mapGrid);
    }

    initRoverPosition() { // TODO: use random
        this.currentPosition = this.getRandomMapPosition_obstacleAware();
        this.currentDirection = this.getRandomDirection();

        console.log('rover position and direction:', this.currentPosition, this.currentDirection);
    }

    getRandomNumber(max) { // return a random between 0 and max
        return Math.floor(Math.random() * (max + 1));
    }

    getRandomDirection(): any {
        const directions = ['N','E','S','W']; // all the possibile rover directions
        const r:number = this.getRandomNumber(directions.length-1); // get a random number between 0 and direction.length (0-3)
        return directions[r]; // return a random direction
    }
} 

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

