const mongoose = require('mongoose');
const Category = require('~/models/category');
const Subject = require('~/models/subject');

const validateSubjectOnCreate = async (subjectData) => {
  const { name, category } = subjectData;

  if (typeof name !== 'string' || !name.trim()) {
    const error = new Error('Name is required and must be a non-empty string.');
    error.status = 400;
    throw error;
  }

  if (name.trim().length < 2 || name.trim().length > 50) {
    const error = new Error('Name must be between 2 and 50 characters.');
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(category)) {
    const error = new Error('Invalid category ID format.');
    error.status = 400;
    throw error;
  }

  const existingCategory = await Category.findById(category).lean();
  if (!existingCategory) {
    const error = new Error('Category not found.');
    error.status = 404;
    throw error;
  }

  const existingSubject = await Subject.findOne({ name: name.trim() }).lean();
  if (existingSubject) {
    const error = new Error('Subject with this name already exists.');
    error.status = 409;
    throw error;
  }

  return {
    name: name.trim(),
    category
  };
};

module.exports = {
  validateSubjectOnCreate
};
