const mongoose = require('mongoose')
const dotenv = require('dotenv')
// dotenv.config({ path: `./${process.env.NODE_ENV}.env` })
dotenv.config({ path: `./development.env` })

const app = require('./app')

// 环境变量测试
// console.log(app.get('env'));

// 连接数据库
// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose
    .connect(process.env.DATABASE_LOCAL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    )
    .then((res) => {
        // console.log(res)
        console.log("连接数据库成功");
    })

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})
