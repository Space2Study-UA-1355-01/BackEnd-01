const User = require('~/models/user')
const {
  roles: { SUPERADMIN, ADMIN }
} = require('~/consts/auth')
const logger = require('~/logger/logger')
const bcrypt = require('bcrypt');

const SeedSuperAdmin = {
  createSuperAdmin: async () => {
    const studentPassword = process.env.MAIL_PASS;
            const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);
    try {
      const superAdmin = {
        role: SUPERADMIN,
        firstName: process.env.MAIL_FIRSTNAME,
        lastName: process.env.MAIL_LASTNAME,
        email: process.env.MAIL_USER,
        password: hashedStudentPassword,
        lastLoginAs: ADMIN,
        active: true,
        isEmailConfirmed: true
      }

      const createdUser = await User.create(superAdmin);
      console.log('Super Admin created');
      return createdUser;
    } catch (err) {
      logger.error(err)
    }
  }
}

module.exports = SeedSuperAdmin
