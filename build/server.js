"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/** source/server.ts */
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var rover_1 = __importDefault(require("./controllers/rover"));
var fs = require("fs");
var path = require("path");
var app = (0, express_1.default)();
var rover = new rover_1.default();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.get("/", function (req, res) {
    res.status(200).render("index", {
        routesList: rover.getRoutesList(),
        roverPosition: rover.currentPosition,
        roverDirection: rover.currentDirection,
        obstaclePosition: false,
        mapGrid: rover.mapGrid,
        mapGridObstacles: rover.mapGridObstacles,
        mapLength: rover.mapLength,
    });
});
/** Logging */
app.use((0, morgan_1.default)("dev"));
/** Parse the request */
app.use(express_1.default.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express_1.default.json());
/** RULES OF OUR API */
app.use(function (req, res, next) {
    // set the CORS policy
    res.header("Access-Control-Allow-Origin", "*");
    // set the CORS headers
    res.header("Access-Control-Allow-Headers", "origin, X-Requested-With,Content-Type,Accept, Authorization");
    // set the CORS method headers
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
        return res.status(200).json({});
    }
    next();
});
/** Routes */
app.use(rover.router);
/** Error handling */
app.use(function (req, res, next) {
    // const error = new Error('There is nothing here.!!!1');
    // return res.status(404).json({
    //     message: error.message,
    //     apiList: rover.getRoutesList()
    // });
    res.status(404).render("404", { routesList: rover.getRoutesList() });
});
/** Server */
var httpServer = http_1.default.createServer(app);
var PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 6060;
httpServer.listen(PORT, function () {
    console.log("The server is running on port ".concat(PORT));
    console.log("http://localhost:" + PORT);
});
