// const res = await fetch('/MarsRover/functions/init');
/*
1. init map, init abstacles, init rover, return position
*/
var rover = await MarsRover.init(); // /MarsRover/init API
/* simply print current rover Coords */
rover.printCoords(); // { ... }
/*
. API for move the rover.
1. check obstacles and check wrapping
*/
var res = await rover.move(['f', 'f', 'f', 'r'])
    .then(function (res) {
    console.log(res);
}); // /MarsRover/move API
