const express = require("express")
const tourControllers = require('../controllers/tourControllers')

const router = express.Router()

router
    .route('/')
    .get(tourControllers.getTours)
    .post(tourControllers.createTour)

router
    .route('/:id')
    .get(tourControllers.getTour)
    .patch(tourControllers.addTour)
    .delete(tourControllers.deleteTour)

module.exports = router
