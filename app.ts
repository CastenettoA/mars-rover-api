 /* tslint:disable */
 
/*
ATTENZIONE:
  i requisiti dicono che il rover riceve un "array di caratteri" di comandi,
  non un array di array con comandi e numeri... KEEP IT SIMPLE, KEEP IT ON REQUIREMENTS.
*/



// todo: create a Map class that rover inherits?

interface Point {
    y: number;
    x: number;
}

class Rover {
    mapLength: number;
    
    //mapGrid: [{
    //     x: number, 
    //     y: number
    // }];
    mapGrid: Array<Object> = [];

    /*
        mapGridObstacles: [
            {y:0, x:1}
            {y:0, x:2}
        ]
    */
    mapGridObstacles: Array<Object> = [];
    mapObsaclesNumber: number;

    currentPosition: Point;
    futurePosition: Point;
    coordChanged: 'x'|'y';
    currentDirection: string;
    status: 'sleeping'|'active';

    getRoverStatus() {
        return {
            mapLength: this.mapLength,
            currentPosition: this.currentPosition,
            currentDirection: this.currentDirection
        }
    }

    /* 
        muovendo il rover modifichiamo la sua posizione, cioè l'oggetto {y:n, x:n}
        L'oggetto viene modificato, per ogni movimento, solo in una cordinata.
        todo: check the command. only f,b,r,l
    */ 
    move(commands: ('f'|'b'|'r'|'l')[]) {
        console.log('move function');
        commands.forEach(c => {

            // calculate the future spatial position of the rover
            // if the rover go out the limit of the map we execute the map function
            // todo: not tested with large map 3,6....
            this.setFuturePosition(c);
            console.log('rover future position ->', this.futurePosition);

            
            // check obstacles. If any block script; else move che rover and continue the loop.
            if( this.isThereObstacles() ) {
                console.log('il movimento richiesto collide con l\'ostacolo')
                console.log('posizione ostacolo: ', this.futurePosition);
                console.log('abbiamo mosso il Rover fino all\'ultimo movimento possibile.');
            } else {
                // no obstacle found, update the futurePosition
                this.currentPosition = this.futurePosition; 
                console.log('no obstacle. change position. The new position of the Rover is:');
                console.log(this.currentPosition);
            }
        });
    }

    isThereObstacles(): boolean {
        /** START HERE
         * this function is not working....... why? response: https://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects
         *
         */

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
            case 'N': this.futurePosition.y++; this.coordChanged = 'y'; break;
            case 'E': this.futurePosition.x++; this.coordChanged = 'x'; break;
            case 'S': this.futurePosition.y--; this.coordChanged = 'y'; break;
            case 'W': this.futurePosition.x--; this.coordChanged = 'x'; break;
        }
    }

    moveBackward() {
        switch(this.currentDirection) {
            case 'N': this.futurePosition.y--; this.coordChanged = 'y'; break;
            case 'E': this.futurePosition.x--; this.coordChanged = 'x'; break;
            case 'S': this.futurePosition.y++; this.coordChanged = 'y'; break;
            case 'W': this.futurePosition.x++; this.coordChanged = 'x'; break;
        }
    }

    moveRight() {
        switch(this.currentDirection) {
            case 'N': this.futurePosition.x++; this.coordChanged = 'x'; break;
            case 'E': this.futurePosition.y--; this.coordChanged = 'y'; break;
            case 'S': this.futurePosition.x--; this.coordChanged = 'x'; break;
            case 'W': this.futurePosition.y++; this.coordChanged = 'y'; break;
        }
    }

    moveLeft() { // TODO
        switch(this.currentDirection) {
            case 'N': this.futurePosition.x--; this.coordChanged = 'x'; break;
            case 'E': this.futurePosition.y++; this.coordChanged = 'y'; break;
            case 'S': this.futurePosition.x++; this.coordChanged = 'x'; break;
            case 'W': this.futurePosition.y--; this.coordChanged = 'y'; break;
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
    // coordChanged is the coordinate (x or y) that is just changed by the move function
    coordIsOutOfMap(): boolean {
        if( this.futurePosition[this.coordChanged] < 0 || this.futurePosition[this.coordChanged] > this.mapLength ) {
            return true; // the current coord is outside the map, so return true to make a position wrapping 
        } else {
            return false;
        }
    }

    // function that execute the rover position wrapping when the rover go outside of the map
    executePositionWrapping() {
        if(this.futurePosition[this.coordChanged] < 0){ 
            // if the rover coord position is out map and is < 0 we move the rover to the opposite (x|y = mapLength)
            this.futurePosition[this.coordChanged] = this.mapLength; 
        }
        else if(this.futurePosition[this.coordChanged] > this.mapLength){
            // if the rover coord position is out map and is > of this.mapLength we move the rover to the opposite (x|y = 0)
            this.futurePosition[this.coordChanged] = 0; 
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

    getRandomDirection(): string {
        const directions = ['N','E','S','W']; // all the possibile rover directions
        const r = this.getRandomNumber(directions.length-1); // get a random number between 0 and direction.length (0-3)
        return directions[r]; // return a random direction
    }


    constructor(mapLength = 1) {
        this.mapLength = mapLength; // set the map length
        this.generateMap(); // generate the map based on map length
        this.generateObstacles(); // generate some random obstacles in the map
        this.initRoverPosition(); // generate a random rover position and direction (N,E,S,W)
        console.log('init complete (map, obstacles & rover position).');
    }
} 

// init the rover istance. You can use rover.getRoverStatus() to get some useful stuff...
let rover = new Rover(); 

// se to the rover some commands to move it
let res = rover.move(['f','b','b']); 

/* THINK OF API
let res = 

**/ 


// COUSNESS LOG!
// non sprecare ene. nella negatività. Sono qui per svolgere questo esercizio, nel bene e nel male!
// costanza, equilibrio. Coraggio e cuore.




/*

TODO TECNICI
- test del codice (funziona move?)
- api
- refractoring

TODO STILE
 - use interfaces, class... getter and setter
 - smart order the property and methods of the class
 - the method name and property are consistent?
 - check comment: simple and clear (see also comment best practices)
 - check the Simple Responsibility Principle and DRY (dont repeat yourself!) ... SOLID ???
 - implement test

 PER L'INTERVISTA
 - il codice non è ottimizzato per un pianeta grande. Lo script è fine a se stesso.
*/

