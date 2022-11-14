/*
ATTENZIONE:
  i requisiti dicono che il rover riceve un "array di caratteri" di comandi,
  non un array di array con comandi e numeri... KEEP IT SIMPLE, KEEP IT ON REQUIREMENTS.
*/
// todo: create a Map class that rover inherits?
var Rover__OLD = /** @class */ (function () {
    function Rover__OLD() {
    }
    Object.defineProperty(Rover__OLD.prototype, "position", {
        get: function () {
            return this.currentPosition;
        },
        enumerable: false,
        configurable: true
    });
    Rover__OLD.prototype.move = function (commands) {
        var _this = this;
        // move(['f','f'])
        commands.forEach(function (c) {
            _this.changeRoverPosition(c);
        });
    };
    Rover__OLD.prototype.checkObstacleCollision = function (command) {
        var p = this.currentPosition; // es. [0,0]
        var d = this.currentDirection; // es. N
        var newPosition = moveForward(p);
        [0, 1];
    };
    // move the rover 1 position forward in the map depending on rover direction
    Rover__OLD.prototype.moveForward = function () {
        // move the rover depending on rover direction
        switch (this.currentDirection) {
            /*
                x ->
            */
        }
        /*
            x ->
        */
        var pos = [0, 0];
        pos[0, 1];
        'N';
        this.currentPosition.y++; // this.currentPosition[0]++
        'E';
        this.currentPosition.x++; // this.currentPosition[1]++          
        'S';
        this.currentPosition.y--;
        'W';
        this.currentPosition.x--;
    };
    return Rover__OLD;
}());
changeRoverPosition(command, strign);
{
    var direction = this.currentDirection; // 'N' or 'E' or ...
    this.checkObstacleCollision();
    switch (command) { // if no collision it's detected we move the rover
        case 'f': moveForward();
        case 'b': moveBackward();
        case 'r': moveRight();
        case 'l': moveLeft();
    }
}
generateObstacles(obstacles, 3);
{ // generate a number of obstacles in the map
    var mapGridObstacles = [];
    // generate obstacles until we reach the obstaclesNumber
    while (mapGridObstacles.length <= obstaclesNumber) {
        var r = getRandomMapPosition();
        if (!mapGridObstacles.contain(r)) {
            mapGridObstacles.push(r); // obstacle not found, i cana add it safely
        }
    }
    this.mapGridObstacles = mapGridObstacles;
}
getRandomMapPosition();
array < number > {
    let: let,
    randomIndex: randomIndex,
    let: let,
    randomMapPosition: randomMapPosition,
    return: randomMapPosition
};
getRandomMapPosition_obstacleAware();
array < number > {
    let: let,
    pass: pass,
    while: function (, pass) {
        var r = this.getRandomMapPosition();
        // check if the random position collides with an obstacle, if not we keep it.
        if (this.mapGridObstacles.contain(r) == false) {
            pass = true;
            this.currentPosition = r;
        }
    }
};
// todo: improve comment
/* map reflection

let map_simple = [
      [0,1], [1,2], ...
];

let map_obj = [
    {y:0, x:0}, {y:1, x:0}, ...
]


*/
generateMap();
{ // generate cartesian map like: [[0,0],[0,1], ...]
    for (var i = 0; i <= this.mapLength; i++) {
        this.mapGrid.push([0, i]); // generate the first x row of the map: [0,0],[0,1],...
        // generate all the y layer based on the first x row of the map: [1,0],[2,0],...
        for (var inner = 1; inner <= this.mapLength; inner++) {
            mapGrid.push([inner, i]);
        }
    }
}
initRoverPosition();
{ // TODO: use random
    this.currentPosition = this.getRandomMapPosition_obstacleAware();
    this.currentDirection = this.getRandomDirection;
}
getRandomNumber(max);
{ // return a random between 0 and max
    return Math.floor(Math.random() * (max + 1));
}
getRandomDirection();
string;
{
    var directions = ['N', 'E', 'S', 'O']; // all the possibile rover directions
    var randomNumber = this.getRandomNumber(directions.length); // get a random number between 0 and direction.length (0-3)
    return direction[r]; // return a random direction
}
contructor(mapLength, 3);
{
    this.mapLength = mapLength; // set the map length
    this.generateMap(); // generate the map based on map length
    this.generateObstacles(); // generate some random obstacles in the map
    this.initRoverPosition(); // generate a random rover position and direction (N,E,S,W)
}
var rover = new Rover(); // create a planet, rover with default option
var res = rover.move(['f', 'f', 'r']);
// COUSNESS LOG!
// non sprecare ene. nella negatività. Sono qui per svolgere questo esercizio, nel bene e nel male!
// costanza, equilibrio. Coraggio e cuore.
/*

TODO TECNICI
- commandlo ostacoli
- implementazione wrapping

TODO STILE
 - use interfaces, class... getter and setter
 - smart order the property and methods of the class
 - the method name and property are consistent?
 - check comment: simple and clear (see also comment best practices)
 - check the Simple Responsibility Principle
 - implement test
*/ 
