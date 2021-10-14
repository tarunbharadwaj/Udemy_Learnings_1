const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
    '/top-5-cheap',
    tourController.aliasTopTours,
    tourController.getAllTours
);
router.get('/tour-stat', tourController.getTourStats);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router.get('/', authController.protect, tourController.getAllTours);
router.get('/:id', tourController.getTour);
router.post('/', tourController.createTour);
router.patch('/:id', tourController.updateTour);
router.delete(
    '/:id',
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
);

module.exports = router;
