const mongoose = require('mongoose');
require('dotenv').config();
require('module-alias/register');

const checkUserExistence = require('./checkUserExistence');
const SeedUsers = require('~/seed/seedUsers');
const SeedCategories = require('~/seed/seedCategories');
const SeedSubjects = require('~/seed/seedSubjects');
const SeedOffers = require('~/seed/seedOffers');
const logger = require('~/logger/logger'); 
const shouldDropDatabase = process.argv.includes('--drop');
const MONGO_URI = process.env.MONGODB_URL;

const seedAll = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    if (shouldDropDatabase) {
      await mongoose.connection.dropDatabase();
      console.log('Database dropped successfully!');
    }

    await checkUserExistence();
    await SeedUsers.createUsers();
    await SeedCategories.createCategories();
    await SeedSubjects.createSubjects();
    await SeedOffers.createOffers();

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding error:', error); 
    process.exit(1);
  }
};

seedAll();
