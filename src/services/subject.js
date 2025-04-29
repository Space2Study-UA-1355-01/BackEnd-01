const Subject = require('~/models/subject');
const Category = require('~/models/category');
const mongoose = require('mongoose');

const subjectService = {
  getSubjects: async ({ search = '', page = 1, limit = 20 } = {}) => {
    const query = {};

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

    return {
      data: subjects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  createSubject: async (subjectData) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(subjectData.category)) {
        const error = new Error('Invalid category ID.');
        error.status = 400;
        throw error;
      }
  
      const existingCategory = await Category.findById(subjectData.category).exec();
      if (!existingCategory) {
        const error = new Error('Category not found.');
        error.status = 404;
        throw error;
      }

      const existingSubject = await Subject.findOne({ name: subjectData.name }).exec();
      if (existingSubject) {
        const error = new Error('Subject with this name already exists.');
        error.status = 409;
        throw error;
      }
  
      const newSubject = new Subject(subjectData);
      await newSubject.save();
  
      return newSubject.toObject();
    } catch (err) {
      if (err.name === 'ValidationError') {
        const error = new Error('Validation failed: ' + err.message);
        error.status = 400;
        throw error;
      }
      throw err;
    }
  }
};

module.exports = subjectService;
