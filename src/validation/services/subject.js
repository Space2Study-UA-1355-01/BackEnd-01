const mongoose = require('mongoose');
const Category = require('~/models/category');
const Subject = require('~/models/subject');

const validateSubjectOnCreate = async (subjectData) => {
const { name, category } = subjectData;

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

const existingSubject = await Subject.findOne({ name }).lean();
if (existingSubject) {
    const error = new Error('Subject with this name already exists.');
    error.status = 409;
    throw error;
}

return subjectData;
};

module.exports = {
    validateSubjectOnCreate,
}