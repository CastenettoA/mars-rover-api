# Mars Rover 🪐🤖
Live link: https://stormy-meadow-92152.herokuapp.com/

*I'm part of the team that explores Mars by sending remotely controlled vehicles to the surface of the planet. 
This is an API that translates the commands sent from earth to instructions that are understood by the rover.*

### Tech Stack
* Node.js + Express for backend server and API
* Typescript
* EJS as templating language engine (for the views)
* Chota.css as CSS-ready theme for the front-end
* XV as Test Runner

### Install
```sh
        git clone https://github.com/CastenettoA/marsRover.git
        npm install
        npm run dev # to start up local dev server
```

### Unit Test
```sh
        npm run test # to perform code test
```

### Usage
Start the local server with **npm run dev** and see the home page on https://localhost:6060 to get started!
These are the available routes:
* /roverInfo *(get) return some simple rover info*
* /mapInfo *(get) return some simple map info*
* /moveRover *(get|post) page to move the rover on the map*
Enjoy 🤖

### Programs Requirements
* You are given the initial starting point (x,y) of a rover and the direction (N,S,E,W) it is facing.
* The rover receives a character array of commands.
* Implement commands that move the rover forward/backward (f,b).
* Implement commands that turn the rover left/right (l,r).
* Implement wrapping from one edge of the grid to another. (planets are spheres after all)
* Implement obstacle detection before each move to a new square. If a given sequence of commands encounters an obstacle, the rover moves up to the last possible point, aborts the sequence and reports the obstacle.

### Live Site
The app is deployed with a free instance on Heroku.
Link: https://stormy-meadow-92152.herokuapp.com/

Some useful heroku command: 
* heroku login
* heroku create
* git push heroku master (for deploy)
* heroku ps:scale web=1
* heroku open
* heroku logs --tail
