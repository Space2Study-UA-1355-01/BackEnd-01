const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const validationMiddleware = require('~/middlewares/validation')
const langMiddleware = require('~/middlewares/appLanguage')
const user = require('~/models/user');

const authController = require('~/controllers/auth')
const signupValidationSchema = require('~/validation/schemas/signup')
const { loginValidationSchema } = require('~/validation/schemas/login')
const resetPasswordValidationSchema = require('~/validation/schemas/resetPassword')
const forgotPasswordValidationSchema = require('~/validation/schemas/forgotPassword')
const jwt = require('jsonwebtoken');



router.post(
  '/signup',
  validationMiddleware(signupValidationSchema),
  langMiddleware,
  asyncWrapper(authController.signup)
)
router.post('/login', validationMiddleware(loginValidationSchema), asyncWrapper(authController.login))
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

router.get('/confirm-email', async (req, res) => {
  const token = req.query.token;
  

  if (!token) return res.status(400).json({ message: 'Tocken not found' });

  try {
    console.log("JWT_CONFIRM_SECRET:", jwt.verify(token, process.env.JWT_CONFIRM_SECRET));
    const decoded = jwt.verify(token, process.env.JWT_CONFIRM_SECRET);
    

    const findUser = await user.findById(decoded.id);
    if (!findUser) return res.status(404).json({ message: 'User not found' });

    findUser.isEmailConfirmed = true;
    await findUser.save();

    res.redirect('http://localhost:3000');
  } catch (err) {
    console.error('Token verification error:', err); 
    res.status(400).send('❌ Invalid or expired token');
  }
});


module.exports = router
