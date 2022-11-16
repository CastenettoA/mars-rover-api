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
// import routesPosts from './routes/posts';
// import routesBooks from './routes/books';
var rover_1 = __importDefault(require("./controllers/rover"));
var router = (0, express_1.default)();
/** Logging */
router.use((0, morgan_1.default)('dev'));
/** Parse the request */
router.use(express_1.default.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express_1.default.json());
/** RULES OF OUR API */
router.use(function (req, res, next) {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});
/** Routes */
// router.use('/', routesPosts);
router.use(new rover_1.default().router);
/** Error handling */
router.use(function (req, res, next) {
    var error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});
/** Server */
var httpServer = http_1.default.createServer(router);
var PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 6060;
httpServer.listen(PORT, function () {
    console.log("The server is running on port ".concat(PORT));
    console.log('http://localhost:' + PORT);
});
