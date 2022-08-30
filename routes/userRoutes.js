const express = require("express")
const userControllers = require('../controllers/userControllers')
const authController = require('../controllers/authController')

const router = express.Router()

router.post('/signup', authController.signUp)
router.post('/login', authController.login)
router.patch('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token?', authController.resetPassword)
router.patch('/updatePassword', authController.protect, authController.updatePassword)

router.patch('/updateMe', authController.protect, userControllers.updateMe)
router.delete('/deleteMe', authController.protect, userControllers.deleteMe)

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
