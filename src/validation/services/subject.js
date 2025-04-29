const mongoose = require('mongoose');
const Category = require('~/models/category');
const filterAllowedFields = require('~/utils/filterAllowedFields')


const allowedSubjectFieldsForUpdate = {
    name: true,
    category: true,
  }

const validateCategoryOnUpdate = async (updateData) => {
  const filteredUpdateData = filterAllowedFields(updateData, allowedSubjectFieldsForUpdate)

  if (filteredUpdateData.category) {
    const categoryId = filteredUpdateData.category;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      const error = new Error('Invalid category ID format.');
      error.status = 400;
      throw error;
    }

    const existingCategory = await Category.findById(categoryId).lean();
    if (!existingCategory) {
      const error = new Error('Category not found.');
      error.status = 404;
      throw error;
    }
  }

  return filteredUpdateData
}

module.exports = {
  allowedSubjectFieldsForUpdate,
  validateCategoryOnUpdate
}
  
