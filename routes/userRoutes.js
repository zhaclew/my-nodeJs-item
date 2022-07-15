const express = require("express")
const userControllers = require('../controllers/userControllers')

const router = express.Router()

router
    .route('/')
    .get(userControllers.getUsers)
    .post(userControllers.createUser)

router
    .route('/:id')
    .get(userControllers.getUser)
    .patch(userControllers.updateUser)
    .delete(userControllers.deleteUser)

module.exports = router
