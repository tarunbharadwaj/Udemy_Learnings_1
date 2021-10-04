const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.get('/top-5-cheap', tourController.aliasTopTours,tourController.getAllTours);
router.get('/tour-stat', tourController.getTourStats);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router.get('/', tourController.getAllTours);
router.get('/:id', tourController.getTour);
router.post('/', tourController.createTour);
router.patch('/:id',tourController.updateTour);
router.delete('/:id',tourController.deleteTour);

module.exports = router;