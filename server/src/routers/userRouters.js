const express = require('express')
const userRouter = express.Router()
const {
  getUserById,
  getUsers,
  deleteUserById,
} = require('../controllers/userController')

userRouter.get('/', getUsers)
userRouter.get('/:id', getUserById)
userRouter.get('/:id', deleteUserById)

module.exports = userRouter
