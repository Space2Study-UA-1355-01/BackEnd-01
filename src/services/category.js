const Category = require('~/models/category')
const Subject = require('~/models/subject');

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
  },

  getSubjectNamesByCategoryId: async (categoryId, { search = '', page = 1, limit = 20 } = {}) => {
    const query = { category: categoryId };
  
    if (search) {
      query.name = { $regex: `^${search}`, $options: 'i' };
    }
  
    const skip = (page - 1) * limit;
  
    const [subjects, total] = await Promise.all([
      Subject.find(query)
        .skip(skip)
        .limit(limit)
        .select('name')
        .lean()
        .exec(),
      Subject.countDocuments(query)
    ]);

    if (subjects.length === 0) {
      const error = new Error('No subjects found for this category.');
      error.status = 404;
      throw error;
    }
  
    const subjectNames = subjects.map(subject => ({
      name: subject.name
    }));
  
    return {
      data: subjectNames,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },
  
  getCategoryById: async (categoryId) => {
    const category = await Category.findById(categoryId).lean().exec();
  
    if (!category) {
      const error = new Error('Category not found.');
      error.status = 404;
      throw error;
    }
  
    return category;
  }
  
};


module.exports = categoryService




