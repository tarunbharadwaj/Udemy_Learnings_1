const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');
// const reviewController = require('../controllers/reviewController');

const router = express.Router();

// POST /tour/2324rt/reviews    -> URL to post the tour review
// GET /tour/2324rt/reviews     -> URL to get the tour reviews
// GET /tour/2324rt/reviews/45155151    -> URL to get the review of a particular tour

// router.post('/:tourId/reviews', authController.protect, authController.restrictTo('user'), reviewController.createReview)

router.use('/:tourId/reviews', reviewRouter);

router.get(
    '/top-5-cheap',
    tourController.aliasTopTours,
    tourController.getAllTours
);
router.get('/tour-stat', tourController.getTourStats);
router.get(
    '/monthly-plan/:year',
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
);

// tours-within?distance=233&center=-40,45&unit=mi
// tours-within/233/center/-40,45/unit/mi
router.get(
    '/tours-within/:distance/center/:latlng/unit/:unit',
    tourController.getToursWithin
);

router.get('/distances/:latlng/unit/:unit', tourController.getDistances);

router.get('/', tourController.getAllTours);
router.post(
    '/',
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
);

router.get('/:id', tourController.getTour);
router.patch(
    '/:id',
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
);
router.delete(
    '/:id',
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
);

module.exports = router;
