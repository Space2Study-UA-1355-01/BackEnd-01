const User = require('~/models/user');
const {
  roles: { STUDENT, TUTOR, ADMIN }
} = require('~/consts/auth'); 
const logger = require('~/logger/logger');

const SeedUsers = {
  createUsers: async () => {
    try {
      const isStudentExist = await User.exists({ role: STUDENT });
      const isTutorExist = await User.exists({ role: TUTOR });
      const isAdminExist = await User.exists({ role: ADMIN });

      if (!isStudentExist) {
        const student = {
          role: STUDENT,
          firstName: 'Student',
          lastName: 'Test',
          email: 'student@example.com',
          password: 'studentqweR123!',
          active: true,
          isEmailConfirmed: true
        };
        await User.create(student);
        console.log('Student created');
      }

      if (!isTutorExist) {
        const tutor = {
          role: TUTOR,
          firstName: 'Tutor',
          lastName: 'test',
          email: 'tutor@example.com',
          password: 'tutorqweR123!',
          active: true,
          isEmailConfirmed: true
        };
        await User.create(tutor);
        console.log('Tutor created');
      }

      if (!isAdminExist) {
        const admin = {
          role: ADMIN,
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          password: 'adminqweR123!',
          active: true,
          isEmailConfirmed: true
        };
        await User.create(admin);
        console.log('Admin created');
      }
    } catch (err) {
      logger.error(err);
    }
  }
};

module.exports = SeedUsers;
