const express = require("express")

const app = express()

app.get('/', (req, res) => {
    res.status(200).json({ "message": 'Hello form the server side!', "app": "item" })
})

app.post('/', (req, res) => {
    res.send('你可以用post方法进来')
})

const port = 3000
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})
