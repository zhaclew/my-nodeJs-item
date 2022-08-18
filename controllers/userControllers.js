const User = require('./../models/userModel')
const apiFeature = require('../utils/apiFeature')
const catchAsync = require('./../utils/catchAsync')
const AppError = require("./../utils/appError")

exports.getUsers = catchAsync(async (req, res, next) => {
    const feature = new apiFeature(User.find(), req.query)
    feature.filter().sort().fields().page()
    const users = await feature.query
    // 返回结果
    res.status(200).json({
        "status": "success",
        "results": users.length,
        "data": users
    })
})

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) { return next(new AppError('没有找到该ID', 404)) }
    res.status(200).json({
        "status": "success",
        "data": user
    })
})

exports.createUser = (req, res) => {
    res.status(500).json({
        "status": "error",
        "message": "未定义该路由"
    })
}
exports.updateUser = (req, res) => {
    res.status(500).json({
        "status": "error",
        "message": "未定义该路由"
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        "status": "error",
        "message": "未定义该路由"
    })
}
