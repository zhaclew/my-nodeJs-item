// 测试一个新脚本接口，可以进行本地文件的导入与删除
const fs = require('fs')
const mongoose = require('mongoose')
const Tour = require('./../../models/tourModel')

const dotenv = require('dotenv')

process.env.NODE_ENV = 'development'
// process.env.NODE_ENV = 'production'
dotenv.config({ path: `./${process.env.NODE_ENV}.env` })

mongoose
    .connect(process.env.DATABASE_LOCAL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    )
    .then((res) => {
        console.log("连接数据库成功");
    })

const Tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))

const importData = async () => {
    try {
        await Tour.create(Tours)
        console.log('成功导入');
    } catch (error) {
        console.log(error);
    }
    process.exit()
}

const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log('删除成功');
    } catch (error) {
        console.log(error);
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    importData()
}
if (process.argv[2] === '--delete') {
    deleteData()
}
