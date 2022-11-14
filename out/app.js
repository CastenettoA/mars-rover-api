/* tslint:disable */
var Rover = /** @class */ (function () {
    function Rover(mapLength) {
        if (mapLength === void 0) { mapLength = 1; }
        //mapGrid: [{
        //     x: number, 
        //     y: number
        // }];
        this.mapGrid = [];
        /*
            mapGridObstacles: [
                {y:0, x:1}
                {y:0, x:2}
            ]
        */
        this.mapGridObstacles = [];
        this.mapLength = mapLength; // set the map length
        this.generateMap(); // generate the map based on map length
        this.generateObstacles(); // generate some random obstacles in the map
        this.initRoverPosition(); // generate a random rover position and direction (N,E,S,W)
        console.log('init complete (map, obstacles & rover position).');
    }
    Rover.prototype.getRoverStatus = function () {
        return {
            mapLength: this.mapLength,
            currentPosition: this.currentPosition,
            currentDirection: this.currentDirection
        };
    };
    /*
        muovendo il rover modifichiamo la sua posizione, cioè l'oggetto {y:n, x:n}
        L'oggetto viene modificato, per ogni movimento, solo in una cordinata.
        todo: check the command. only f,b,r,l
    */
    Rover.prototype.move = function (commands) {
        var _this = this;
        console.log('move function');
        commands.forEach(function (c) {
            // calculate the future spatial position of the rover
            // if the rover go out the limit of the map we execute the map function
            // todo: not tested with large map 3,6....
            _this.setFuturePosition(c);
            console.log('rover future position ->', _this.futurePosition);
            // check obstacles. If any block script; else move che rover and continue the loop.
            if (_this.isThereObstacles()) {
                console.log('il movimento richiesto collide con l\'ostacolo');
                console.log('posizione ostacolo: ', _this.futurePosition);
                console.log('abbiamo mosso il Rover fino all\'ultimo movimento possibile.');
            }
            else {
                // no obstacle found, update the futurePosition
                _this.currentPosition = _this.futurePosition;
                console.log('no obstacle. change position. The new position of the Rover is:');
                console.log(_this.currentPosition);
            }
        });
    };
    Rover.prototype.isThereObstacles = function () {
        /** START HERE
         * this function is not working....... why? response: https://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects
         *
         */
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
    Rover.prototype.setFuturePosition = function (command) {
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
    Rover.prototype.moveForward = function () {
        switch (this.currentDirection) {
            case 'N':
                this.futurePosition.y++;
                this.coordChanged = 'y';
                break;
            case 'E':
                this.futurePosition.x++;
                this.coordChanged = 'x';
                break;
            case 'S':
                this.futurePosition.y--;
                this.coordChanged = 'y';
                break;
            case 'W':
                this.futurePosition.x--;
                this.coordChanged = 'x';
                break;
        }
    };
    Rover.prototype.moveBackward = function () {
        switch (this.currentDirection) {
            case 'N':
                this.futurePosition.y--;
                this.coordChanged = 'y';
                break;
            case 'E':
                this.futurePosition.x--;
                this.coordChanged = 'x';
                break;
            case 'S':
                this.futurePosition.y++;
                this.coordChanged = 'y';
                break;
            case 'W':
                this.futurePosition.x++;
                this.coordChanged = 'x';
                break;
        }
    };
    Rover.prototype.moveRight = function () {
        switch (this.currentDirection) {
            case 'N':
                this.futurePosition.x++;
                this.coordChanged = 'x';
                break;
            case 'E':
                this.futurePosition.y--;
                this.coordChanged = 'y';
                break;
            case 'S':
                this.futurePosition.x--;
                this.coordChanged = 'x';
                break;
            case 'W':
                this.futurePosition.y++;
                this.coordChanged = 'y';
                break;
        }
    };
    Rover.prototype.moveLeft = function () {
        switch (this.currentDirection) {
            case 'N':
                this.futurePosition.x--;
                this.coordChanged = 'x';
                break;
            case 'E':
                this.futurePosition.y++;
                this.coordChanged = 'y';
                break;
            case 'S':
                this.futurePosition.x++;
                this.coordChanged = 'x';
                break;
            case 'W':
                this.futurePosition.y--;
                this.coordChanged = 'y';
                break;
        }
    };
    // check if we are outside of the map. If yes we execute the wrapping; if not we do nothing.
    Rover.prototype.wrapping = function () {
        if (this.coordIsOutOfMap()) {
            this.executePositionWrapping();
        }
    };
    // check if the future position modified coord (x or y) is out of map boundaries.
    // if the x or y is < 0 of > this.mapLength we are out of the map...
    // coordChanged is the coordinate (x or y) that is just changed by the move function
    Rover.prototype.coordIsOutOfMap = function () {
        if (this.futurePosition[this.coordChanged] < 0 || this.futurePosition[this.coordChanged] > this.mapLength) {
            return true; // the current coord is outside the map, so return true to make a position wrapping 
        }
        else {
            return false;
        }
    };
    // function that execute the rover position wrapping when the rover go outside of the map
    Rover.prototype.executePositionWrapping = function () {
        if (this.futurePosition[this.coordChanged] < 0) {
            // if the rover coord position is out map and is < 0 we move the rover to the opposite (x|y = mapLength)
            this.futurePosition[this.coordChanged] = this.mapLength;
        }
        else if (this.futurePosition[this.coordChanged] > this.mapLength) {
            // if the rover coord position is out map and is > of this.mapLength we move the rover to the opposite (x|y = 0)
            this.futurePosition[this.coordChanged] = 0;
        }
    };
    Rover.prototype.generateObstacles = function (obstacles) {
        if (obstacles === void 0) { obstacles = 2; }
        var mapGridObstacles = [];
        var _loop_1 = function () {
            var r = this_1.getRandomMapPosition(); // it's an obj like {y:1, x:2}
            if (!mapGridObstacles.some(function (element) { return element == r; })) { // todo: make method?
                // l'ostacolo non è già presente alla lista, lo aggiungo.
                mapGridObstacles.push(r); // obstacle not found, i cana add it safely
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
    Rover.prototype.getRandomMapPosition = function () {
        // todo: check if right the random -1!!
        var randomIndex = this.getRandomNumber(this.mapGrid.length - 1); // get a random index
        var randomMapPosition = this.mapGrid[randomIndex];
        return randomMapPosition;
    };
    Rover.prototype.getRandomMapPosition_obstacleAware = function () {
        var pass = false;
        var _loop_2 = function () {
            var r = this_2.getRandomMapPosition(); // like 
            // check if the random position collides with an obstacle, if not we keep it.
            // todo: this is orrible
            if (!this_2.mapGridObstacles.some(function (element) { return element == r; })) {
                pass = true;
                return { value: r };
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
    Rover.prototype.generateMap = function () {
        for (var i = 0; i <= this.mapLength; i++) {
            this.mapGrid.push({ y: 0, x: i }); // generate the first x row of the map like {y:0, x:0}...
            // generate all the y layer based on the first x row of the map like {y:1, x:0}...
            for (var inner = 1; inner <= this.mapLength; inner++) {
                this.mapGrid.push({ y: inner, x: i });
            }
        }
        console.log('map', this.mapGrid);
    };
    Rover.prototype.initRoverPosition = function () {
        this.currentPosition = this.getRandomMapPosition_obstacleAware();
        this.currentDirection = this.getRandomDirection();
        console.log('rover position and direction:', this.currentPosition, this.currentDirection);
    };
    Rover.prototype.getRandomNumber = function (max) {
        return Math.floor(Math.random() * (max + 1));
    };
    Rover.prototype.getRandomDirection = function () {
        var directions = ['N', 'E', 'S', 'W']; // all the possibile rover directions
        var r = this.getRandomNumber(directions.length - 1); // get a random number between 0 and direction.length (0-3)
        return directions[r]; // return a random direction
    };
    return Rover;
}());
// init the rover istance. You can use rover.getRoverStatus() to get some useful stuff...
var rover = new Rover();
// se to the rover some commands to move it
var res = rover.move(['f', 'b', 'b']);
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
//# sourceMappingURL=app.js.map