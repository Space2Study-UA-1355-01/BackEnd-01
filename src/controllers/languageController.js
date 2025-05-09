const { fetchLanguages } = require('../services/languageService');

const getLanguages = async (req, res, next) => {
  try {
    const languages = await fetchLanguages();
    res.status(200).json(languages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLanguages
};