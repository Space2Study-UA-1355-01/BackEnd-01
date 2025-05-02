const categoryService = require('~/services/category')
const mongoose = require('mongoose');

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

const getSubjectNamesByCategoryId = async (req, res) => {
  const { id } = req.params;
  const { search = '', page = 1, limit = 20 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid category ID format.' });
  }

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const subjectNames = await categoryService.getSubjectNamesByCategoryId(id, {
    search,
    page: parsedPage,
    limit: parsedLimit,
  });

  res.status(200).json(subjectNames);
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid category ID format.' });
  }

  const category = await categoryService.getCategoryById(id);
  
  res.status(200).json(category);
};

const getCategoryNames = async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const names = await categoryService.getCategoryNames({
    search,
    page: parsedPage,
    limit: parsedLimit
  });

  res.status(200).json(names);
};

const createCategory = async (req, res) => {
  const { name, appearance } = req.body;

  if (!name || !appearance?.icon || !appearance?.color) {
    return res.status(400).json({ message: 'Name, icon, and color are required.' });
  }

  const newCategory = await categoryService.createCategory({ name, appearance });

  res.status(201).json(newCategory);
};

const getSubjectsByCategoryId = async (req, res) => {
  const { id } = req.params;
  const { search = '', page = 1, limit = 20 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid category ID format.' });
  }

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const subjects = await categoryService.getSubjectsByCategoryId(id, {
    search,
    page: parsedPage,
    limit: parsedLimit,
  });

  res.status(200).json(subjects);
};


module.exports = {
  getCategories,
  getSubjectNamesByCategoryId,
  getCategoryById,
  getCategoryNames,
  createCategory,
  getSubjectsByCategoryId
};