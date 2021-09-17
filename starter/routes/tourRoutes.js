const express = require('express');
const tourController = require('./../controllers/tourController');
//or we can also import as: const {getAllTours, getTour, createTour} = require('./../controllers/tourController'); , then we no need to mention exports. in the controller file


const router = express.Router();

// router.param('id', tourController.checkID);

router.get('/', tourController.getAllTours);
router.get('/:id', tourController.getTour);
router.post('/', tourController.createTour);


module.exports = router;