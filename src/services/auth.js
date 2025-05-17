const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI
});

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID environment variable is required');
}

const tokenService = require('~/services/token')
const emailService = require('~/services/email')
const { getUserByEmail, createUser, privateUpdateUser, getUserById } = require('~/services/user')
const { createError } = require('~/utils/errorsHelper')
const {
  EMAIL_NOT_CONFIRMED,
  INCORRECT_CREDENTIALS,
  BAD_RESET_TOKEN,
  BAD_REFRESH_TOKEN,
  USER_NOT_FOUND,
  BAD_CONFIRM_TOKEN,
  DOCUMENT_NOT_FOUND,
  EMAIL_ALREADY_CONFIRMED
} = require('~/consts/errors')
const emailSubject = require('~/consts/emailSubject')
const {
  tokenNames: { REFRESH_TOKEN, RESET_TOKEN, CONFIRM_TOKEN }
} = require('~/consts/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10

const authService = {
  signup: async (role, firstName, lastName, email, password, language) => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await createUser(role, firstName, lastName, email, hashedPassword, language)

    const confirmToken = tokenService.generateConfirmToken({ id: user._id, role })
    await tokenService.saveToken(user._id, confirmToken, CONFIRM_TOKEN)
    await emailService.sendEmail(email, emailSubject.EMAIL_CONFIRMATION, language, { confirmToken, email, firstName })
    return {
      userId: user._id,
      userEmail: user.email
    }
  },

  login: async (email, password, isFromGoogle) => {
    const user = await getUserByEmail(email)

    if (!user) {
      throw createError(401, USER_NOT_FOUND)
    }

    const checkedPassword = isFromGoogle || (await bcrypt.compare(password, user.password))

    if (!checkedPassword) {
      throw createError(401, INCORRECT_CREDENTIALS)
    }

    const { _id, lastLoginAs, isFirstLogin, isEmailConfirmed } = user

    if (!isEmailConfirmed) {
      throw createError(401, EMAIL_NOT_CONFIRMED)
    }

    const tokens = tokenService.generateTokens({ id: _id, role: lastLoginAs, isFirstLogin })
    await tokenService.saveToken(_id, tokens.refreshToken, REFRESH_TOKEN)

    if (isFirstLogin) {
      await privateUpdateUser(_id, { isFirstLogin: false })
    }

    await privateUpdateUser(_id, { lastLogin: new Date() })

    return tokens
  },

  logout: async (refreshToken) => {
    await tokenService.removeRefreshToken(refreshToken)
  },

  refreshAccessToken: async (refreshToken) => {
    const tokenData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await tokenService.findToken(refreshToken, REFRESH_TOKEN)

    if (!tokenData || !tokenFromDB) {
      throw createError(400, BAD_REFRESH_TOKEN)
    }

    const { _id, lastLoginAs, isFirstLogin } = await getUserById(tokenData.id)

    const tokens = tokenService.generateTokens({ id: _id, role: lastLoginAs, isFirstLogin })
    await tokenService.saveToken(_id, tokens.refreshToken, REFRESH_TOKEN)

    return tokens
  },

  sendResetPasswordEmail: async (email, language) => {
    const user = await getUserByEmail(email)

    if (!user) {
      throw createError(404, USER_NOT_FOUND)
    }

    const { _id, firstName } = user

    const resetToken = tokenService.generateResetToken({ id: _id, firstName, email })
    await tokenService.saveToken(_id, resetToken, RESET_TOKEN)

    await emailService.sendEmail(email, emailSubject.RESET_PASSWORD, language, { resetToken, email, firstName })
  },

  updatePassword: async (resetToken, password, language) => {
    const tokenData = tokenService.validateResetToken(resetToken)
    const tokenFromDB = await tokenService.findToken(resetToken, RESET_TOKEN)

    if (!tokenData || !tokenFromDB) {
      throw createError(400, BAD_RESET_TOKEN)
    }

    const { id: userId, firstName, email } = tokenData
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    await privateUpdateUser(userId, { password: hashedPassword })

    await tokenService.removeResetToken(userId)

    await emailService.sendEmail(email, emailSubject.SUCCESSFUL_PASSWORD_RESET, language, {
      firstName
    })
  },

  confirmEmail: async (confirmToken) => {
    if (!confirmToken) {
      throw createError(400, BAD_CONFIRM_TOKEN)
    }

    const tokenData = jwt.verify(confirmToken, process.env.JWT_CONFIRM_SECRET)

    if (!tokenData || !tokenData.id) {
      throw createError(400, BAD_CONFIRM_TOKEN)
    }

    const user = await getUserById(tokenData.id)
    if (!user) {
      throw createError(400, BAD_CONFIRM_TOKEN)
    }

    if (user.isEmailConfirmed == true) {
      throw createError(400, EMAIL_ALREADY_CONFIRMED)
    }

    await privateUpdateUser(user._id, { isEmailConfirmed: true })
    return { message: 'Email successfully confirmed' }
  },

  loginWithGoogle: async (idToken, role = 'student') => {
    try {
      const googleUser = await verifyGoogleToken(idToken);
      let user = await getUserByEmail(googleUser.email);
      
      if (!user) {
        // Step 1: Create user first with role array
        const roles = [role];
        user = await createUser(
          roles,
          googleUser.firstName || '',
          googleUser.lastName || '',
          googleUser.email,
          'googleAuth123',
          'en',
          true
        );
      } else {
        // If user exists, just update lastLoginAs
        await privateUpdateUser(user._id, {
          lastLoginAs: role // role як string
        });
      }

      // Get tokens
      const tokens = await authService.login(googleUser.email, null, true);
      
      if (!tokens) {
        throw createError(401, {
          code: 'LOGIN_FAILED',
          message: 'Failed to generate auth tokens'
        });
      }

      return tokens;
    } catch (error) {
      console.error('Google auth error:', error);
      throw createError(401, {
        code: 'GOOGLE_AUTH_FAILED',
        message: error.message || 'Google authentication failed'
      });
    }
  }
}

async function verifyGoogleToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    
    if (!payload) {
      throw createError(401, {
        code: 'INVALID_GOOGLE_TOKEN',
        message: 'Invalid or expired Google token'
      });
    }
    
    return {
      email: payload.email,
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      avatar: payload.picture || '',
      sub: payload.sub
    };
  } catch (error) {
    console.error('Google token verification failed:', error);
    throw createError(401, {
      code: 'INVALID_GOOGLE_TOKEN', 
      message: 'Failed to verify Google token'
    });
  }
}

module.exports = authService
