const Category = require('~/models/category')

const categoryService = {
  getCategories: async () => {
    return await Category.find().lean().exec()
  }
}

module.exports = categoryService
