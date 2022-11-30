/** source/server.ts */
import http from "http";
import express, { Express } from "express";
import morgan from "morgan";
import cors from 'cors';
require('dotenv').config() // todo: avoid this and configure heroku local vars
import RoverController from "./controllers/rover";
import { DatabaseController } from "./controllers/database";
var fs = require("fs");
var path = require("path");

const app: Express = express();

/** Server */
const httpServer = http.createServer(app);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
  console.log("http://localhost:" + PORT);
});

/** Socket logic */
import { Server, Socket } from "socket.io";
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8080", "https://mars-rover-vue-v2.netlify.app/"]
  }
}); // init a new istance of socket.io passing the http server

const rover = new RoverController(io); // init routes, main app logic.


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

/** Logging */
app.use(morgan("dev"));
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());

/* Enable All CORS request (Cross Origin Resource Sharing) */
app.use(cors());

/** RULES OF OUR API */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");   // set the CORS policy
  res.header("Access-Control-Allow-Headers","origin, X-Requested-With,Content-Type,Accept, Authorization"); // set the CORS headers
  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  next();
});

app.get("/", (req, res) => {
  res.status(200).render("index", {
    routesList: rover.getRoutesList(), // array of available api routes
    obstaclePosition: false,
    dbData: DatabaseController.getAll() // retrive all map&rover info from json db
  });
});

/** Routes */
app.use(rover.router);

/** Error handling */
app.use((req, res, next) => {
  // const error = new Error('There is nothing here.!!!1');
  // return res.status(404).json({
  //     message: error.message,
  //     apiList: rover.getRoutesList()
  // });

  res.status(404).render("404", { routesList: rover.getRoutesList() });
});