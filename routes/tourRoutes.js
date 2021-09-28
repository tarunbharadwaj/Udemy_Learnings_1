const express = require('express');
const tourController = require('./../controllers/tourController');
//or we can also import as: const {getAllTours, getTour, createTour} = require('./../controllers/tourController'); , then we no need to mention exports. in the controller file


const router = express.Router();

// router.param('id', tourController.checkID);

router.get('/top-5-cheap', tourController.aliasTopTours,tourController.getAllTours);
router.get('/tour-stat', tourController.getTourStats);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router.get('/', tourController.getAllTours);
router.get('/:id', tourController.getTour);
router.post('/', tourController.createTour);
router.patch('/:id',tourController.updateTour);
router.delete('/:id',tourController.deleteTour);

module.exports = router;