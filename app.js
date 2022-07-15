const express = require("express")
const morgan = require("morgan")

const toursRoute = require("./routes/tourRoutes")
const usersRoute = require("./routes/userRoutes")

const app = express()

// 使用第三方中间件
app.use(morgan("dev"))
// 使用中间件
app.use(express.json())
// 自定义中间件
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

// 创建不同的路由控制器来控制api路由

app.use('/api/v1/tours', toursRoute)
app.use('/api/v1/users', usersRoute)

module.exports = app
