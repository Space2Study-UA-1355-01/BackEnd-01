const Offer = require('~/models/offer');
const Subject = require('~/models/subject');
const User = require('~/models/user');
const {
  enums: {
    MAIN_ROLE_ENUM,
    SPOKEN_LANG_ENUM,
    PROFICIENCY_LEVEL_ENUM,
    OFFER_STATUS_ENUM
  }
} = require('~/consts/validation');
const logger = require('~/logger/logger');

const SeedOffers = {
  createOffers: async () => {
    try {
      const author = await User.findOne({ role: 'tutor' });
      if (!author) {
        throw new Error('User with role "tutor" not found.');
      }

      const subjects = await Subject.find().populate('category').limit(20);
      if (!subjects.length) {
        throw new Error('No available subjects found to create offers.');
      }

      if (!Array.isArray(PROFICIENCY_LEVEL_ENUM) || !PROFICIENCY_LEVEL_ENUM.length) {
        throw new Error('PROFICIENCY_LEVEL_ENUM is not defined or empty.');
      }

      const offerPromises = subjects.map((subject, i) => {
        return Offer.create({
          price: 50 + i * 10,
          proficiencyLevel: PROFICIENCY_LEVEL_ENUM[i % PROFICIENCY_LEVEL_ENUM.length],
          title: `Sample Offer ${i + 1} for ${subject.name}`,
          description: `This is a description for ${subject.name} offer.`,
          languages: [SPOKEN_LANG_ENUM[i % SPOKEN_LANG_ENUM.length]],
          authorRole: MAIN_ROLE_ENUM[0],
          author: author._id,
          category: subject.category?._id,
          subject: subject._id,
          status: OFFER_STATUS_ENUM[0],
          FAQ: [
            {
              question: 'What is included?',
              answer: 'The offer includes full support for the subject.'
            },
            {
              question: 'Who is it for?',
              answer: 'It is for students of all levels.'
            }
          ]
        });
      });

      await Promise.all(offerPromises);
      console.log('5 offers created successfully!');
    } catch (err) {
      logger.error('Error while creating offers:', err);
    }
  }
};

module.exports = SeedOffers;
