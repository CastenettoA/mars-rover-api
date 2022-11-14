"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://www.section.io/engineering-education/how-to-create-a-simple-rest-api-using-typescript-and-nodejs/
var controllers_1 = require("../controllers/");
var router = express.Router();
router.get('/rover', controllers_1.default.initRover);
router.put('/move', controllers_1.default.moveRover);
// more easy implementation (vanilla)
// https://www.topcoder.com/thrive/articles/how-to-build-rest-apis-with-typescript-with-no-frameworks-and-only-using
