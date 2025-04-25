const categoryService = require('~/services/category')

const getCategories = async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const categories = await categoryService.getCategories({
    search,
    page: parsedPage,
    limit: parsedLimit,
  });

  res.status(200).json(categories);
};

