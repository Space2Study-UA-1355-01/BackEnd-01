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

    const categoriesWithOffers = categories.map(category => ({
      ...category,
      totalOffers: Math.floor(Math.random() * 101)
    }));

    return {
      data: categoriesWithOffers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  getSubjectNamesByCategoryId: async (categoryId, { search = '', page = 1, limit = 20 } = {}) => {
    const query = { category: categoryId, status: 'active' };
  
    if (search) {
      query.name = { $regex: `^${search}`, $options: 'i' };
    }
  
    const skip = (page - 1) * limit;
  
    const [subjects, total] = await Promise.all([
      Subject.find(query)
        .skip(skip)
        .limit(limit)
        .select('id name')
        .lean()
        .exec(),
      Subject.countDocuments(query)
    ]);

    if (subjects.length === 0) {
      const error = new Error('No subjects found for this category.');
      error.status = 404;
      throw error;
    }
  
    return {
      data: subjects,
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
  
    return {
      ...category,
      totalOffers: 10
    };
  },

  getCategoryNames: async ({ search = '', page = 1, limit = 20 } = {}) => {
    const query = {};
  
    if (search) {
      query.name = { $regex: `^${search}`, $options: 'i' };
    }
  
    const skip = (page - 1) * limit;
  
    const [categories, total] = await Promise.all([
      Category.find(query)
        .skip(skip)
        .limit(limit)
        .select('id name')
        .lean()
        .exec(),
      Category.countDocuments(query)
    ]);

    if (!categories.length) {
      const error = new Error('Category not found.');
      error.status = 404;
      throw error;
    }
  
    return {
      data: categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  createCategory: async ({ name, appearance }) => {
    try {
      const existingCategory = await Category.findOne({ name }).exec();
      if (existingCategory) {
        const error = new Error('Category with this name already exists.');
        error.status = 409; 
        throw error;
      }

      const newCategory = new Category({ name, appearance });
      await newCategory.save();

      return newCategory.toObject();
    } catch (err) {
      if (err.name === 'ValidationError') {
        const error = new Error('Validation failed: ' + err.message);
        error.status = 400;
        throw error;
      }
      throw err;
    }
  },

  getSubjectsByCategoryId: async (categoryId, { search = '', page = 1, limit = 20 } = {}) => {
    const query = { category: categoryId, status: 'active' };
  
    if (search) {
      query.name = { $regex: `^${search}`, $options: 'i' };
    }
  
    const skip = (page - 1) * limit;
  
    const [subjects, total] = await Promise.all([
      Subject.find(query)
        .skip(skip)
        .limit(limit)
        .lean()
        .populate('category', 'name appearance')
        .exec(),
      Subject.countDocuments(query)
    ]);

    if (subjects.length === 0) {
      const error = new Error('No subjects found for this category.');
      error.status = 404;
      throw error;
    }
  
    return {
      data: subjects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },
  
};


module.exports = categoryService




