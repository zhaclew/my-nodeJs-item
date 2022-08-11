const express = require("express")
const morgan = require("morgan")

const toursRoute = require("./routes/tourRoutes")
const usersRoute = require("./routes/userRoutes")
const appError = require("./utils/appError")
const globalErrorHandler = require("./controllers/errorController")

const app = express()

process.env.NODE_ENV === "development" && console.log('我是开发环境');
process.env.NODE_ENV === "production" && console.log('我是生产环境');

// 使用第三方中间件
app.use(morgan("dev"))

// 使用中间件
app.use(express.json())

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
