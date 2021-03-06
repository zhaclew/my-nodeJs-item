const fs = require("fs")

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`))

exports.checkId = (req, res, next, val) => {
    if (val > tours.length) {
        return res.status(404).json({
            "status": "fail",
            "message": "无效ID"
        })
    }
    next()
}

exports.getTours = (req, res) => {
    res.status(200).json({
        "status": "success",
        "requestTime": req.requestTime,
        "result": tours.length,
        "data": { tours }
    })
}
exports.getTour = (req, res) => {
    // filter 会找到所有匹配的， find 只会找到第一个
    const tour = tours.find(el => el.id == req.params.id)
    res.status(200).json({
        "status": "success",
        "data": tour
    })
}
exports.createTour = (req, res) => {
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
}
exports.deleteTour = (req, res) => {
    res.status(204).json({
        "status": "success",
        "data": {
            tours: null
        }
    })
}
exports.addTour = (req, res) => {
    res.status(200).json({
        "status": "success",
        "data": {
            tours: '已添加更新'
        }
    })
}
