const Subject = require('~/models/subject');
const { validateCategoryOnUpdate } = require('~/validation/services/subject')

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

    const subject = await Subject.findById(subjectId)
      .populate('category', 'name appearance')
      .lean()
      .exec();

    if (!subject) {
      const error = new Error('Subject not found.');
      error.status = 404;
      throw error;
    }

    return subject;
  },

  updateSubject: async (subjectId, updateData) => {
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      const error = new Error('Subject not found.');
      error.status = 404;
      throw error;
    }

    const validatedData = await validateCategoryOnUpdate(updateData);

    const updatedSubject = await Subject.findByIdAndUpdate(subjectId, validatedData, {
      new: true,
      runValidators: true
    })
      .populate('category', 'name appearance')
      .lean()
      .exec();
  
    return updatedSubject;
  }
};

module.exports = subjectService;
