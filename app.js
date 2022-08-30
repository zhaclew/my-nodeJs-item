const express = require("express")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")

const toursRoute = require("./routes/tourRoutes")
const usersRoute = require("./routes/userRoutes")
const appError = require("./utils/appError")
const globalErrorHandler = require("./controllers/errorController")

const app = express()

process.env.NODE_ENV === "development" && console.log('我是开发环境');
process.env.NODE_ENV === "production" && console.log('我是生产环境');
// 设置安全 http headers
app.use(helmet())

// 使用第三方中间件
app.use(morgan("dev"))

// 使用 rateLimit 中间件添加 IP 限制，防止高频率攻击
const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 60 * 1000,
    message: '你访问了太多次，请一小时后再来'
})
app.use('/api', limiter)

// 限制 req.body 接收的 data 参数大小
app.use(express.json({ limit: '20kb' }))

// 防止 NoSQL 查询注入： 例如只知道密码不知道邮箱地址，使用了 $ge:"" 作为邮箱值来条件查询便能登录
app.use(mongoSanitize())

// 防止恶意代码插入问题 XSS
app.use(xss())

// 防止参数污染 - 这个要放到所有保护手段最后，因为它是清理的。 部分参数可以手动设置白名单 whitelist
app.use(hpp({ whitelist: ['price', 'duration'] }))

// 访问静态文件
app.use(express.static(`${__dirname}/public`))

// 自定义中间件
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

// 创建不同的路由控制器来控制api路由

app.use('/api/v1/tours', toursRoute)
app.use('/api/v1/users', usersRoute)


// 处理所有没有处理或找不到的 url
app.all('*', (req, res, next) => {
    next(new appError(`没有找到${req.originalUrl}`, 404))
})
// 处理全局错误捕捉
app.use(globalErrorHandler)
module.exports = app
