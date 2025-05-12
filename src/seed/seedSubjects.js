const Subject = require('~/models/subject'); // Make sure the path is correct
const Category = require('~/models/category');
const logger = require('~/logger/logger');

const SeedSubjects = {
  createSubjects: async () => {
    try {
      const categorySubjectsMap = {
        'Design': ['UX/UI Design', 'Graphic Design', 'Motion Design'],
        'Mathematics': ['Algebra', 'Geometry', 'Probability Theory'],
        'Programming': [
          'Frontend Development',
          'Backend Development',
          'Mobile Development',
          'Game Development',
          'DevOps',
          'Embedded Systems',
          'Data Structures & Algorithms',
          'Databases',
          'Machine Learning',
          'Artificial Intelligence',
          'Cybersecurity',
          'Cloud Computing',
          'APIs & Integrations',
          'Software Testing',
          'Web Development',
          'Desktop Applications',
          'Systems Programming',
          'Version Control (Git)',
          'Programming Paradigms',
          'Code Architecture & Design Patterns'
        ]
      };

      let createdCount = 0;
      let existingCount = 0;

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
            createdCount++;
          } else {
            existingCount++;
          }
        }
      }

      console.log(`Subjects created: ${createdCount}, already existed: ${existingCount}`);
    } catch (err) {
      logger.error('Error while seeding subjects:', err);
    }
  }
};

module.exports = SeedSubjects;
