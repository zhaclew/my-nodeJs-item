const User = require('./../models/userModel')
const apiFeature = require('../utils/apiFeature')
const catchAsync = require('./../utils/catchAsync')
const AppError = require("./../utils/appError")

const myUpdateFilter = (obj, ...allField) => {
    let newDate = {}
    Object.keys(obj).forEach(el => {
        if (allField.includes(el)) newDate[el] = obj[el]
    })
    return newDate
}

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

exports.updateMe = catchAsync(async (req, res, next) => {
    // 找到该用户，允许更新name和email
    // 过滤允许的数据
    const filterData = myUpdateFilter(req.body, 'name', 'email')
    const user = await User.findByIdAndUpdate(req.user._id, filterData, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        "status": "success",
        "data": user
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false })
    res.status(204).json({
        "status": "success",
        "data": null
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

