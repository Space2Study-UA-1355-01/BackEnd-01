const Subject = require('~/models/subject'); // Make sure the path is correct
const Category = require('~/models/category');
const logger = require('~/logger/logger');

const SeedSubjects = {
  createSubjects: async () => {
    try {
      const categorySubjectsMap = {
        'Design': ['UX/UI Design', 'Graphic Design', 'Motion Design'],
        'Mathematics': ['Algebra', 'Geometry', 'Probability Theory'],
        'Programming': ['Frontend Development', 'Backend Development', 'Mobile Development']
      };

      for (const [categoryName, subjects] of Object.entries(categorySubjectsMap)) {
        const category = await Category.findOne({ name: categoryName });

        if (!category) {
          console.log(`Category "${categoryName}" not found. Skipping its subjects.`);
          continue;
        }

        for (const subjectName of subjects) {
          const exists = await Subject.exists({ name: subjectName, category: category._id });

          if (!exists) {
            await Subject.create({
              name: subjectName,
              category: category._id,
              totalOffers: {
                student: 0,
                tutor: 0
              }
            });
            console.log(`Subject "${subjectName}" created under category "${categoryName}".`);
          } else {
            console.log(`Subject "${subjectName}" already exists under category "${categoryName}".`);
          }
        }
      }
    } catch (err) {
      logger.error(err);
    }
  }
};

module.exports = SeedSubjects;
