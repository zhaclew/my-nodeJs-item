const AppError = require("./../utils/appError")

const handleCastErrorDB = err => {
    const message = `无效的 ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const message = `已存在重复的值：${Object.values(err.keyValue)[0]}.`
    return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `无效的输入：${errors.join(' 和 ')}`
    return new AppError(message, 400)
}

const handleJsonWebTokenError = () => {
    return new AppError('无效签名，请重新登录', 401)
}

const handleTokenExpiredError = () => {
    return new AppError('过期签名，请重新登录', 401)
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    // isOperational 有些报错信息不想给客户端看可以关闭/开启这个
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.error('ERROR ☆☆☆☆☆', err);
        res.status(500).json({
            status: 'error',
            message: '某些违规操作引起了错误'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.status = err.status || 'fail'
    err.statusCode = err.statusCode || 500
    // 开发环境下错误日志输出
    if (process.env.NODE_ENV === "development") sendErrorDev(err, res)
    // 生产环境下错误日志输出
    if (process.env.NODE_ENV === "production") {
        let error = { ...err }
        error.message = err.message
        if (err.name === "CastError") error = handleCastErrorDB(error)
        if (err.code === 11000) error = handleDuplicateFieldsDB(error)
        if (err.name === "ValidationError") error = handleValidationErrorDB(error)
        if (err.name === "JsonWebTokenError") error = handleJsonWebTokenError()
        if (err.name === "TokenExpiredError") error = handleTokenExpiredError()
        sendErrorProd(error, res)
    }
    next()
}
