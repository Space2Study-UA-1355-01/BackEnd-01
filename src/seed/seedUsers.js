const User = require('~/models/user');
const bcrypt = require('bcrypt');
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
        const studentPassword = 'studentqweR123!';
        const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

        const student = {
          role: STUDENT,
          firstName: 'Student',
          lastName: 'Test',
          email: 'student@example.com',
          password: hashedStudentPassword,
          lastLoginAs: STUDENT,
          active: true,
          isEmailConfirmed: true
        };
        await User.create(student);
        console.log('Student created');
      }

      if (!isTutorExist) {
        const tutorPassword = 'tutorqweR123!';
        const hashedTutorPassword = await bcrypt.hash(tutorPassword, 10);

        const tutor = {
          role: TUTOR,
          firstName: 'Tutor',
          lastName: 'test',
          email: 'tutor@example.com',
          password: hashedTutorPassword,
          lastLoginAs: TUTOR,
          active: true,
          isEmailConfirmed: true
        };
        await User.create(tutor);
        console.log('Tutor created');
      }

      if (!isAdminExist) {
        const adminPassword = 'adminqweR123!';
        const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

        const admin = {
          role: ADMIN,
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          password: hashedAdminPassword,
          lastLoginAs: ADMIN,
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
