const Subject = require('~/models/subject');
const { validateCategoryOnUpdate, validateSubjectOnCreate } = require('~/validation/services/subject')


const subjectService = {
  getSubjects: async ({ search = '', page = 1, limit = 20 } = {}) => {
    const query = { status: 'active' };

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

  createSubject: async (subjectData, userRole) => {
    try {
      const validatedData = await validateSubjectOnCreate(subjectData);
      
      if (['student', 'tutor'].includes(userRole)) {
        validatedData.status = 'requested';
      }
  
      const newSubject = new Subject(validatedData);
      await newSubject.save();
  
      return newSubject.toObject();
    } catch (err) {
      if (err.name === 'ValidationError') {
        const error = new Error('Validation failed: ' + err.message);
        error.status = 400;
        throw error;
      }
      throw err;
    }
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

    const validatedData = await validateCategoryOnUpdate(subjectId, updateData);

    const updatedSubject = await Subject.findByIdAndUpdate(subjectId, validatedData, {
      new: true,
      runValidators: true
    })
      .populate('category', 'name appearance')
      .lean()
      .exec();
  
    return updatedSubject;
  },

  deleteSubject: async (subjectId) => {
    const subject = await Subject.findById(subjectId);
  
    if (!subject) {
      const error = new Error('Subject not found.');
      error.status = 404;
      throw error;
    }
  
    await Subject.findByIdAndDelete(subjectId);
  }
};

module.exports = subjectService;
