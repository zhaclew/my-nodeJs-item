const mongoose = require('mongoose')
const dotenv = require('dotenv')

// 处理连接网络数据库的错误
process.on("uncaughtException", err => {
    console.log("uncaughtException 出错了");
    console.log(err.name, err.message);
    process.exit(1)
})

dotenv.config({ path: `./${process.env.NODE_ENV}.env` })
// dotenv.config({ path: `./development.env` })

const app = require('./app')

// 环境变量测试
// console.log(app.get('env'));

// 连接网络数据库
// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose
    // .connect(DB,
    // 连接本地数据库
    .connect(process.env.DATABASE_LOCAL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    )
    .then(res => console.log("连接数据库成功"))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
})

process.on("unhandledRejection", err => {
    console.log("unhandledRejection 出错了");
    console.log(err.name, err.message);
    server.close(() => process.exit(1))
})
