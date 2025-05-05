const Category = require('~/models/category');
const logger = require('~/logger/logger');

const SeedCategories = {
  createCategories: async () => {
    try {
      const categories = [
        {
          name: 'Design',
          appearance: {
            icon: 'icons/design.svg',
            color: '#FF5733'
          }
        },
        {
          name: 'Mathematics',
          appearance: {
            icon: 'icons/mathematics.svg',
            color: '#3498db'
          }
        },
        {
          name: 'Programming',
          appearance: {
            icon: 'icons/programming.svg',
            color: '#2ecc71'
          }
        },
        {
          name: 'Marketing',
          appearance: {
            icon: 'icons/marketing.svg',
            color: '#f1c40f'
          }
        },
        {
          name: 'Finance',
          appearance: {
            icon: 'icons/finance.svg',
            color: '#9b59b6'
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
