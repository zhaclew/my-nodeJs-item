const Tour = require('./../models/tourModel')
const apiFeature = require('../utils/APIFeature')
const catchAsync = require('./../utils/catchAsync')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`))
exports.getTours = catchAsync(async (req, res, next) => {
    const feature = new apiFeature(Tour.find(), req.query)
    feature.filter().sort().fields().page()
    const tours = await feature.query
    // 返回结果
    res.status(200).json({
        "status": "success",
        "results": tours.length,
        "data": tours
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
        "status": "success",
        "data": tour
    })
})

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
        "status": "success",
        "data": newTour
    })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
        "status": "success",
        "data": null
    })
})

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        "status": "success",
        "data": { tour }
    })
})

exports.getToursGroup = catchAsync(async (req, res, next) => {
    const tour = await Tour.aggregate([
        { $match: { price: { $gte: 0 } } },
        {
            $group: {
                _id: '$difficulty',
                num: { $sum: 1 },
                price: { $avg: '$price' },
                maxPrice: { $max: '$price' },
                minPrice: { $min: '$price' },
                rating: { $avg: '$rating' },
                name: { $push: '$name' }
            }
        },
        { $sort: { rating: 1 } }
    ])
    res.status(200).json({
        "status": "success",
        "data": tour
    })
})

// 找出当前年份的哪前三个月活动出现最多
exports.getMaxMonth = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1 || 0
    const tour = await Tour.aggregate([
        { $unwind: "$startTime" },
        {
            $match: {
                startTime: {
                    $lte: new Date(`${year}-12-31`),
                    $gte: new Date(`${year}-01-01`)
                }
            }
        },
        {
            $group: {
                _id: { $month: "$startTime" },
                num: { $sum: 1 },
                name: { $push: "$name" }
            }
        },
        { $addFields: { month: "$_id" } },
        { $project: { _id: 0 } },
        { $sort: { num: -1 } },
        { $limit: 3 }
    ])
    res.status(200).json({
        "status": "成功响应",
        "data": tour
    })
})

        // 排除搜索的一些关键字段
        // const queryObj = { ...req.query }
        // const excludeFields = ['page', 'sort', 'fields', 'limit']
        // excludeFields.forEach(element => { delete queryObj[element] });
        // // 高级搜索
        // let queryStr = JSON.stringify(queryObj)
        // queryStr = queryStr.replace(/\b(lt|lte|gt|gte)/g, el => `$${el}`)

        // // 开始搜索
        // let query = Tour.find(JSON.parse(queryStr))
        // 排序
        // if (req.query.sort) {
        //     const sortStr = req.query.sort.split(',').join(" ")
        //     query = query.sort(sortStr)
        // } else {
        //     query = query.sort("-creationTime")
        // }

        // // 显示查询字段信息
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(" ")
        //     query = query.select(fields)
        // } else {
        //     query = query.select("-__v")
        // }

        // // 分页功能
        // const page = req.query.page * 1 || 1
        // const limit = req.query.limit * 1 || 100
        // const skip = (page - 1) * limit
        // query = query.skip(skip).limit(limit)
        // if(req.query.page) {
        //     // 拿到 Tour 的所有个数
        //     const numTours = await Tour.countDocuments()
        //     // if (skip >= numTours) {
        //     //     throw new Error('没有更多数据')
        //     // }
        // }
        // const api = new apiFeature(queryObj, query)
