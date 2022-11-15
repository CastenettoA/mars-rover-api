// this file connect the route to their controller
import express from 'express';
import controller from '../controllers/rover_old';

const router = express.Router();

router.get('/initRover', controller.initRover);
router.put('/moveRover/:commands', controller.moveRover);

export = router;