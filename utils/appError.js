class appError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'

        this.isOperational = true
        // 把构造器内的错误内容添加到 Error 的堆栈中
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = appError
