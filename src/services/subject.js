const Subject = require('~/models/subject');
const Category = require('~/models/category');

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

    const subjectsWithCategoryNames = subjects.map(subject => ({
      ...subject, 
    }));

    return {
      data: subjectsWithCategoryNames,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
};

module.exports = subjectService;
