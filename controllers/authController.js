const crypto = require('crypto')
const util = require('util')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require("./../utils/appError")
const sendMail = require("./../utils/email")

// jwt 加密
const tokenCode = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signUp = catchAsync(async (req, res, next) => {
    // 这个功能自由度太高谁都能注册管理员
    const newUser = await User.create(req.body)
    // 可以采用下面这种方案限制接收数据
    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirm: req.body.passwordConfirm,
    //     phone: req.body.phone,
    //     changePasswordAt: req.body.changePasswordAt,
    //     role: req.body.role
    // })
    const token = tokenCode(newUser._id)
    res.status(201).json({
        status: "success",
        data: newUser,
        token
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }, "password")
    console.log(user);
    if (!user || !(await user.comparePasswords(password, user.password))) {
        return next(new AppError('无效的邮箱或密码', 401))
    }
    const token = tokenCode(user._id)
    res.status(200).json({
        status: "success",
        token
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    // 检测是否存在token
    let token = null
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = await req.headers.authorization.split(' ')[1]
    }
    console.log(req.headers.authorization);
    if (!token) {
        return next(new AppError('请先登录后访问', 401))
    }
    // 解码 jwt 认证
    const decode = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // 检测当前用户是否存在和是否更改密码
    const currentUser = await User.findById(decode.id)
    if (!currentUser) next(new AppError('当前用户不存在', 401))
    if (currentUser.changePassword(decode.iat)) next(new AppError('密码发生变化，请重新登录', 401))
    // 传递 token 或其它值给接下来的中间件使用
    req.user = currentUser
    next()
})

exports.limitedTo = (...roles) => {
    // 限制 - 只有 admin 和 leader 才能执行该操作， user 普通用户不可以
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) next(new AppError('您没有操作权限', 403))
        next()
    }
}

// 忘记密码 - 填写邮箱给用户邮箱发送短信
exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) next(new AppError('该邮箱不存在', 404))
    const resetToken = await user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })
    // const resetURL = `${req.protocol}${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    try {
        sendMail({
            from: process.env.MAIL_PUBLISHER,
            to: user.email,
            subject: '我的重置密码服务 - 还有十分钟过期',
            text: '验证码：' + resetToken
        });
        res.status(200).json({
            status: 'success',
            message: '邮件发送成功'
        })
    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })
        return next(new AppError('该邮箱不存在，请稍后再试', 500))
    }
})

// 重置密码
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1.确定邮件发来的 token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })
    // 2.校验加密的token, 成功通过则设置新密码
    if(!user) next(new AppError('token过期，请重新获取邮箱验证码', 400))
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetExpires = undefined
    user.passwordResetToken = undefined
    await user.save()
    // 3.更新 changePasswordAt 到数据库， 这一步已在userModel完成 - changePasswordAt: Update
    // 4.保存更新数据库
    const token = tokenCode(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})
