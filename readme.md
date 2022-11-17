# Mars Rover
I'm part of the team that explores Mars by sending remotely controlled vehicles to the surface of the planet. 
This is an API that translates the commands sent from earth to instructions that are understood by the rover.

### Tech Stack
* Nodejs + Express for build backend server and API
* Typescript for build the Rover Class
* EJS as templating language to generate HTML markup
* Chota as CSS-ready theme
* XV as Test Runner

### Install
```sh
        git clone https://github.com/CastenettoA/marsRover.git
        npm install
        npm run dev // start the server
```

### Unit Test
        npm run test

### Usage
Se the home page on https://localhost:6060 to get started!

### Programs Requirements
* You are given the initial starting point (x,y) of a rover and the direction (N,S,E,W) it is facing.
* The rover receives a character array of commands.
* Implement commands that move the rover forward/backward (f,b).
* Implement commands that turn the rover left/right (l,r).
* Implement wrapping from one edge of the grid to another. (planets are spheres after all)
* Implement obstacle detection before each move to a new square. If a given sequence of commands encounters an obstacle, the rover moves up to the last possible point, aborts the sequence and reports the obstacle.
