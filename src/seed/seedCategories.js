const Category = require('~/models/category');
const logger = require('~/logger/logger');

const SeedCategories = {
  createCategories: async () => {
    try {
      const categories = [
        { name: 'Design', appearance: { icon: '#bc9d06', color: '#d8cb8d' } },
        { name: 'Mathematics', appearance: { icon: '#2c7b19', color: '#9cd88d' } },
        { name: 'Programming', appearance: { icon: '#194b7b', color: '#8baccb' } },
        { name: 'Marketing', appearance: { icon: '#9314a3', color: '#dbb9df' } },
        { name: 'Finance', appearance: { icon: '#a31444', color: '#dca3b6' } },
        { name: 'History', appearance: { icon: '#bc9d06', color: '#d8cb8d' } },
        { name: 'Music', appearance: { icon: '#2c7b19', color: '#9cd88d' } },
        { name: 'Languages', appearance: { icon: '#194b7b', color: '#8baccb' } },
        { name: 'Painting', appearance: { icon: '#a31444', color: '#dca3b6' } },
        { name: 'Chemistry', appearance: { icon: '#bc9d06', color: '#d8cb8d' } },
        { name: 'Astronomy', appearance: { icon: '#2c7b19', color: '#9cd88d' } },
        { name: 'Audit', appearance: { icon: '#194b7b', color: '#8baccb' } },
        { name: 'Biology', appearance: { icon: '#9314a3', color: '#dbb9df' } },
        { name: 'Physics', appearance: { icon: '#4b0082', color: '#b0a8d1' } },
        { name: 'Philosophy', appearance: { icon: '#3c3c3c', color: '#c2c2c2' } },
        { name: 'Psychology', appearance: { icon: '#008080', color: '#b2dfdb' } },
        { name: 'Engineering', appearance: { icon: '#607d8b', color: '#cfd8dc' } },
        { name: 'Architecture', appearance: { icon: '#795548', color: '#d7ccc8' } },
        { name: 'Law', appearance: { icon: '#6d4c41', color: '#bcaaa4' } },
        { name: 'Ecology', appearance: { icon: '#388e3c', color: '#a5d6a7' } }
      ];

      let createdCount = 0;
      let existingCount = 0;

      for (const categoryData of categories) {
        const exists = await Category.exists({ name: categoryData.name });

        if (!exists) {
          await Category.create(categoryData);
          createdCount++;
        } else {
          existingCount++;
        }
      }

      console.log(`Categories created: ${createdCount}, already existed: ${existingCount}`);
    } catch (err) {
      logger.error('Error while seeding categories:', err);
    }
  }
};

module.exports = SeedCategories;
