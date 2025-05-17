const { OAuth2Client } = require('google-auth-library')
const authService = require('~/services/auth')
const { oneDayInMs } = require('~/consts/auth')
const {
  config: { COOKIE_DOMAIN }
} = require('~/configs/config')
const {
  tokenNames: { REFRESH_TOKEN, ACCESS_TOKEN }
} = require('~/consts/auth')
const user = require('~/models/user');
const jwt = require('jsonwebtoken');

const COOKIE_OPTIONS = {
  maxAge: oneDayInMs,
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  domain: COOKIE_DOMAIN
}

const signup = async (req, res) => {
  const { role, firstName, lastName, email, password } = req.body
  const lang = req.lang

  const userData = await authService.signup(role, firstName, lastName, email, password, lang)

  res.status(201).json(userData)
}

const login = async (req, res) => {
  const { email, password } = req.body

  const tokens = await authService.login(email, password)

  res.cookie(ACCESS_TOKEN, tokens.accessToken, COOKIE_OPTIONS)
  res.cookie(REFRESH_TOKEN, tokens.refreshToken, COOKIE_OPTIONS)

  delete tokens.refreshToken

  res.status(200).json(tokens)
}

const loginWithGoogle = async (req, res) => {
  try {
    const { idToken, role } = req.body;
    
    // Validate role
    const validRoles = ['student', 'tutor', 'admin', 'superadmin'];
    const userRole = validRoles.includes(role) ? role : 'student';
    
    if (!idToken) {
      return res.status(400).json({
        status: 400,
        code: 'MISSING_TOKEN',
        message: 'Google ID token is required'
      });
    }

    const tokens = await authService.loginWithGoogle(idToken, userRole);
    
    res.cookie(ACCESS_TOKEN, tokens.accessToken, COOKIE_OPTIONS);
    res.cookie(REFRESH_TOKEN, tokens.refreshToken, COOKIE_OPTIONS);
    
    delete tokens.refreshToken;
    return res.status(200).json(tokens);

  } catch (error) {
    console.error('Google auth controller error:', error);
    return res.status(error.status || 401).json({
      status: error.status || 401,
      code: error.code || 'GOOGLE_AUTH_FAILED',
      message: error.message || 'Google authentication failed'
    });
  }
};


const logout = async (req, res) => {
  const { refreshToken } = req.cookies

  await authService.logout(refreshToken)

  res.clearCookie(REFRESH_TOKEN)
  res.clearCookie(ACCESS_TOKEN)

  res.status(204).end()
}

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies

  if (!refreshToken) {
    res.clearCookie(ACCESS_TOKEN)

    return res.status(401).end()
  }

  const tokens = await authService.refreshAccessToken(refreshToken)

  res.cookie(ACCESS_TOKEN, tokens.accessToken, COOKIE_OPTIONS)
  res.cookie(REFRESH_TOKEN, tokens.refreshToken, COOKIE_OPTIONS)

  delete tokens.refreshToken

  res.status(200).json(tokens)
}

const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body
  const lang = req.lang

  await authService.sendResetPasswordEmail(email, lang)

  res.status(204).end()
}

const updatePassword = async (req, res) => {
  const { password } = req.body
  const resetToken = req.params.token
  const lang = req.lang

  await authService.updatePassword(resetToken, password, lang)

  res.status(204).end()
}


const confirmEmail = async (req, res) => {
    const { confirmToken } = req.params; 
    const result = await authService.confirmEmail(confirmToken);
    res.status(200).json(result)
}

module.exports = {
  signup,
  login,
  loginWithGoogle,
  logout,
  refreshAccessToken,
  sendResetPasswordEmail,
  updatePassword,
  confirmEmail
}
