const express = require("express")
const tourControllers = require('../controllers/tourControllers')

const router = express.Router()

// router.param('id', tourControllers.checkId)

// 聚合管道测试
router.route('/group-test').get(tourControllers.getToursGroup)

// 聚合管道测试 - 年份筛选
router.route('/group-maxMonth/:year?').get(tourControllers.getMaxMonth)

router
    .route('/')
    .get(tourControllers.getTours)
    .post(tourControllers.createTour)

router
    .route('/:id')
    .get(tourControllers.getTour)
    .patch(tourControllers.updateTour)
    .delete(tourControllers.deleteTour)

module.exports = router
