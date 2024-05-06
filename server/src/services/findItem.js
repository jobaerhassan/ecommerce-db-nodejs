const { default: mongoose } = require('mongoose')
const createError = require('http-errors')
const findWithId = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options)
    if (!item) {
      throw createError(404, `${Model.modelName} does not exist with this id`)
    }
    return item
  } catch (error) {
    if (error instanceof mongoose.Error) {
      // for resolving the mongoose error.
      throw createError(400, 'invalid item id')
    }
    throw error
  }
}
module.exports = { findWithId }
