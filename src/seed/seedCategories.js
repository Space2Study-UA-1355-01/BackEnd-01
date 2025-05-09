const Category = require('~/models/category');
const logger = require('~/logger/logger');

const SeedCategories = {
  createCategories: async () => {
    try {
      const categories = [
        {
          name: 'Design',
          appearance: {
            icon: '#bc9d06',
            color: '#d8cb8d'
          }
        },
        {
          name: 'Mathematics',
          appearance: {
            icon: '#2c7b19',
            color: '#9cd88d'
          }
        },
        {
          name: 'Programming',
          appearance: {
            icon: '#194b7b',
            color: '#8baccb'
          }
        },
        {
          name: 'Marketing',
          appearance: {
            icon: '#9314a3',
            color: '#dbb9df'
          }
        },
        {
          name: 'Finance',
          appearance: {
            icon: '#a31444',
            color: '#dca3b6'
          }
        }
      ];

      for (const categoryData of categories) {
        const exists = await Category.exists({ name: categoryData.name });

        if (!exists) {
          await Category.create(categoryData);
          console.log(`Category "${categoryData.name}" created successfully.`);
        } else {
          console.log(`Category "${categoryData.name}" already exists.`);
        }
      }
    } catch (err) {
      logger.error(err);
    }
  }
};

module.exports = SeedCategories;
