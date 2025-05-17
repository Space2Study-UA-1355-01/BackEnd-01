const router = require('express').Router()
const { OAuth2Client } = require('google-auth-library')

const asyncWrapper = require('~/middlewares/asyncWrapper')
const validationMiddleware = require('~/middlewares/validation')
const langMiddleware = require('~/middlewares/appLanguage')

const authController = require('~/controllers/auth')
const signupValidationSchema = require('~/validation/schemas/signup')
const { loginValidationSchema } = require('~/validation/schemas/login')
const resetPasswordValidationSchema = require('~/validation/schemas/resetPassword')
const forgotPasswordValidationSchema = require('~/validation/schemas/forgotPassword')

router.post(
  '/signup',
  validationMiddleware(signupValidationSchema),
  langMiddleware,
  asyncWrapper(authController.signup)
)
router.post('/login', validationMiddleware(loginValidationSchema), asyncWrapper(authController.login))
router.post('/google', asyncWrapper(authController.loginWithGoogle))
router.post('/logout', asyncWrapper(authController.logout))
router.get('/refresh', asyncWrapper(authController.refreshAccessToken))
router.post(
  '/forgot-password',
  validationMiddleware(forgotPasswordValidationSchema),
  langMiddleware,
  asyncWrapper(authController.sendResetPasswordEmail)
)
router.patch(
  '/reset-password/:token',
  validationMiddleware(resetPasswordValidationSchema),
  langMiddleware,
  asyncWrapper(authController.updatePassword)
)

router.get('/confirm-email/:confirmToken', asyncWrapper(authController.confirmEmail))
router.get('/google/test', asyncWrapper(async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ 
      error: 'GOOGLE_CLIENT_ID not configured'
    });
  }

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  res.json({
    status: 'ok',
    clientConfigured: !!client,
    clientId: process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...'
  });
}));

module.exports = router
