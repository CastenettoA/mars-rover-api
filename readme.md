# Mars Rover (backend api) 🪐🤖
Live link: https://mars-rover-api.herokuapp.com/

*I'm part of the team that explores Mars by sending remotely controlled vehicles to the surface of the planet. 
This is an API that translates the commands sent from earth to instructions that are understood by the rover.*

### Tech Stack
* Node.js + Express (backend server, API, rover class), TypeScript.
* EJS as templating language engine (for the /views).
* A simple db.json file that is used like a database with the help of DatabaseController class. db_local.json for local env. db_prod.json for the prod environment.
* Socket.io used to update clients on roverPosition change 😉
* XV as Test Runner & Chota.css as a cool css theme reset.

### Install
```sh
        git clone https://github.com/CastenettoA/mars-rover-api.git
        npm install
        npm run dev # to start up local dev server
```

### Unit Test
```sh
        npm run test # to perform code test
```

### Usage
Start the local server with **npm run dev** (or heroku local) and see the home page on https://localhost:6060 to get started!

These are the available routes:
* **/roverInfo** *(get) return some simple rover info*
* **/mapInfo** *(get) return some simple map info*
* **/moveRover** *(get|post) page to move the rover on the map*

### Programs Requirements
* You are given the initial starting point (x,y) of a rover and the direction (N,S,E,W) it is facing.
* The rover receives a character array of commands.
* Implement commands that move the rover forward/backward (f,b).
* Implement commands that turn the rover left/right (l,r).
* Implement wrapping from one edge of the grid to another. (planets are spheres after all)
* Implement obstacle detection before each move to a new square. If a given sequence of commands encounters an obstacle, the rover moves up to the last possible point, aborts the sequence and reports the obstacle.

### Live Site
The app is deployed with a free instance on Heroku.
Link: https://mars-rover-api.herokuapp.com/

Some useful heroku command: 
* heroku login
* heroku create
* git push heroku master (for deploy)
* heroku ps:scale web=1
* heroku ps:restart
* heroku open
* heroku logs --tail
* heroku config #to see config vars
* heroku config:set/get...
