const subjectService = require('~/services/subject');
const mongoose = require('mongoose');

const getSubjects = async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const subjects = await subjectService.getSubjects({
    search,
    page: parsedPage,
    limit: parsedLimit,
  });

  res.status(200).json(subjects);
};

const getSubjectById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid subject ID format.' });
  }

  const subject = await subjectService.getSubjectById(id);

  res.status(200).json(subject);
};

const updateSubject = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid subject ID format.' });
  }

  const updatedSubject = await subjectService.updateSubject(id, updates);

  res.status(200).json(updatedSubject);
};

module.exports = {
  getSubjects,
  getSubjectById,
  updateSubject,
};
