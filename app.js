const fs = require("fs")
const express = require("express")

const app = express()

// 使用中间件
app.use(express.json())


// app.get('/', (req, res) => {
//     res.status(200).json({ "message": 'Hello form the server side!', "app": "item" })
// })

// app.post('/', (req, res) => {
//     res.send('你可以用post方法进来')
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`))

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        "status": "success",
        "result": tours.length,
        "data": { tours }
    })
})

// url 传参处理，指定和不指定参数
app.get(`/api/v1/tours/:id/:x?`, (req, res) => {
    let id = req.params.id * 1

    if (id > tours.length) {
        res.status(404).json({
            "status": "fail",
            "message": "无效ID"
        })
    }

    const tour = tours.find(el => el.id == id)
    res.status(200).json({
        "status": "success",
        "data": tour
    })
})

app.post('/api/v1/tours', (req, res) => {
    const newId = Number(tours[tours.length - 1].id) + 1
    const newTours = Object.assign({ id: newId }, req.body)

    // 保存新的参数到本地 JSON 文件中
    tours.push(newTours)
    fs.writeFile(`${__dirname}/dev-data/data/tours.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            "status": "success",
            "result": tours.length,
            "data": { tours }
        })
    })

})


const port = 3000
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})
