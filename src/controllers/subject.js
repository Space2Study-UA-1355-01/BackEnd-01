const subjectService = require('~/services/subject');

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

  if (!subjectData?.name || !subjectData?.category) {
    return res.status(400).json({ message: 'Name and category are required.' });
  }

  const newSubject = await subjectService.createSubject(subjectData);

  res.status(201).json(newSubject);
};


module.exports = {
  getSubjects,
  createSubject,
};
