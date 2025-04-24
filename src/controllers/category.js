const categoryService = require('~/services/category')

const getCategories = async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const categories = await categoryService.getCategories({
    search,
    page: parseInt(page),
    limit: parseInt(limit),
  });

  res.status(200).json(categories);
};

module.exports = {
  getCategories
}