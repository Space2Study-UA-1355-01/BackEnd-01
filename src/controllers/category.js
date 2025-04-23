const categoryService = require('~/services/category')

const getCategories = async (req, res) => {
  const categories = await categoryService.getCategories()
  res.status(200).json(categories)
}

module.exports = {
  getCategories
}