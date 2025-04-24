const Category = require('~/models/category')

const categoryService = {
  getCategories: async ({ search = '', page = 1, limit = 20 } = {}) => {
    const query = {};

    if (search) {
      query.name = { $regex: `^${search}`, $options: 'i' };
    }
 
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find(query).skip(skip).limit(limit).lean().exec(),
      Category.countDocuments(query)
    ]);

    return {
      data: categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
};


module.exports = categoryService




