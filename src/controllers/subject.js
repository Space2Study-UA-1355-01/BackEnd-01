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

const createSubject = async (req, res) => {
  const subjectData = req.body;
  
  const userRole = req.user?.role;
  console.log('req.user:', req.user);
  console.log("ddddddddddddd" + userRole);

  if (!subjectData?.name || !subjectData?.category) {
    return res.status(400).json({ message: 'Name and category are required.' });
  }

  const newSubject = await subjectService.createSubject(subjectData, userRole);

  res.status(201).json(newSubject);
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

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No updates provided.' });
  }

  const updatedSubject = await subjectService.updateSubject(id, updates);

  res.status(200).json(updatedSubject);
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid subject ID format.' });
  }

  await subjectService.deleteSubject(id);

  res.status(200).json({ message: 'Subject successfully deleted.' });
};

module.exports = {
  getSubjects,
  getSubjectById,
  updateSubject,
  createSubject,
  deleteSubject,
};
