const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get('/', reviewController.getAllReviews);
router.post(
    '/',
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
);

router.get('/:id', reviewController.getReview);

router.use(authController.restrictTo('user', 'admin'));

router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
