const Subject = require('~/models/subject');

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

  getSubjectById: async (subjectId) => {

    const subject = await Subject.findById(subjectId).lean().exec();

    if (!subject) {
      const error = new Error('Subject not found.');
      error.status = 404;
      throw error;
    }

    return subject;
  }
};

module.exports = subjectService;
