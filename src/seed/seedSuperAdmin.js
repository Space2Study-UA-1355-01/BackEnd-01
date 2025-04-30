const User = require('~/models/user')
const {
  roles: { SUPERADMIN }
} = require('~/consts/auth')
const logger = require('~/logger/logger')

const SeedSuperAdmin = {
  createSuperAdmin: async () => {
    try {
      const superAdmin = {
        role: SUPERADMIN,
        firstName: process.env.MAIL_FIRSTNAME,
        lastName: process.env.MAIL_LASTNAME,
        email: process.env.MAIL_USER,
        password: process.env.MAIL_PASS,
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
