const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const {
  lengths: { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH },
  enums: { ROLE_ENUM }
} = require('~/consts/validation')
const errors = require('~/consts/errors')
const tokenService = require('~/services/token')
const Token = require('~/models/token')
const { expectError } = require('~/test/helpers')

describe('Auth controller', () => {
  let app, server, signupResponse

  beforeAll(async () => {
    ; ({ app, server } = await serverInit())
  })

  beforeEach(async () => {
    signupResponse = await app.post('/auth/signup').send(user)
  })

  afterEach(async () => {
    await serverCleanup()
  })

  afterAll(async () => {
    await stopServer(server)
  })

  const user = {
    role: 'student',
    firstName: 'test',
    lastName: 'test',
    email: 'test@gmail.com',
    password: 'testpass_135'
  }

  describe('Signup endpoint', () => {
    it('should throw validation errors for the firstName field', async () => {
      const responseForFormat = await app.post('/auth/signup').send({ ...user, firstName: '12345' })
      const responseForNull = await app.post('/auth/signup').send({ ...user, firstName: null })

      const formatError = errors.NAME_FIELD_IS_NOT_OF_PROPER_FORMAT('firstName')
      const nullError = errors.FIELD_IS_NOT_DEFINED('firstName')
      expectError(422, formatError, responseForFormat)
      expectError(422, nullError, responseForNull)
    })

    it('should throw validation errors for the email format', async () => {
      const responseForFormat = await app.post('/auth/signup').send({ ...user, email: 'test' })
      const responseForType = await app.post('/auth/signup').send({ ...user, email: 312938 })

      const formatError = errors.FIELD_IS_NOT_OF_PROPER_FORMAT('email')
      const typeError = errors.FIELD_IS_NOT_OF_PROPER_TYPE('email', 'string')
      expectError(422, formatError, responseForFormat)
      expectError(422, typeError, responseForType)
    })

    it('should throw validation error for the role value', async () => {
      const signupResponse = await app.post('/auth/signup').send({ ...user, role: 'test' })

      const error = errors.FIELD_IS_NOT_OF_PROPER_ENUM_VALUE('role', ROLE_ENUM)
      expectError(422, error, signupResponse)
    })

    it('should throw validation errors for the password`s length', async () => {
      const responseForMax = await app
        .post('/auth/signup')
        .send({ ...user, password: '1'.repeat(MAX_PASSWORD_LENGTH + 1) })

      const responseForMin = await app
        .post('/auth/signup')
        .send({ ...user, password: '1'.repeat(MIN_PASSWORD_LENGTH - 1) })

      const error = errors.FIELD_IS_NOT_OF_PROPER_LENGTH('password', {
        min: MIN_PASSWORD_LENGTH,
        max: MAX_PASSWORD_LENGTH
      })
      expectError(422, error, responseForMax)
      expectError(422, error, responseForMin)
    })

    it('should throw ALREADY_REGISTERED error', async () => {
      await app.post('/auth/signup').send(user)

      const response = await app.post('/auth/signup').send(user)

      expectError(409, errors.ALREADY_REGISTERED, response)
    })
  })

  describe('SendResetPasswordEmail endpoint', () => {
    it('should throw USER_NOT_FOUND error', async () => {
      const response = await app.post('/auth/forgot-password').send({ email: 'invalid@gmail.com' })

      expectError(404, errors.USER_NOT_FOUND, response)
    })
  })

  describe('UpdatePassword endpoint', () => {
    let resetToken
    beforeEach(() => {
      const { firstName, email, role } = user

      resetToken = tokenService.generateResetToken({ id: signupResponse.body.userId, firstName, email, role })

      Token.findOne = jest.fn().mockResolvedValue({ save: jest.fn().mockResolvedValue(resetToken) })
    })
    afterEach(() => jest.resetAllMocks())

    it('should throw BAD_RESET_TOKEN error', async () => {
      const response = await app.patch('/auth/reset-password/invalid-token').send({ password: 'valid_pass1' })

      expectError(400, errors.BAD_RESET_TOKEN, response)
    })
  })

  describe('Google Auth endpoint', () => {
    const mockGooglePayload = {
      email: 'test@gmail.com',
      given_name: 'Test',
      family_name: 'User',
      picture: 'https://example.com/photo.jpg',
      sub: '12345'
    }

    beforeEach(() => {
      jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockImplementation(() => ({
        getPayload: () => mockGooglePayload
      }))
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should authenticate with Google and return tokens', async () => {
      const response = await app
        .post('/auth/google')
        .send({ idToken: 'valid_google_token' })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('accessToken') 
      expect(response.cookies).toHaveProperty('refreshToken')
    })

    it('should return 400 when idToken is missing', async () => {
      const response = await app.post('/auth/google').send({})
      expect(response.status).toBe(400)
    })

    it('should return 401 for invalid Google token', async () => {
      OAuth2Client.prototype.verifyIdToken.mockRejectedValue(new Error())
      
      const response = await app
        .post('/auth/google') 
        .send({ idToken: 'invalid_token' })

      expect(response.status).toBe(401)
    })

    it('should create new user when logging in with Google for first time', async () => {
      const response = await app
        .post('/auth/google')
        .send({ idToken: 'valid_google_token' });

      expect(response.status).toBe(200);
      const user = await User.findOne({ email: mockGooglePayload.email });
      expect(user).toBeTruthy();
      expect(user.isEmailConfirmed).toBe(true);
    });

    it('should login existing user with Google', async () => {
      await User.create({
        email: mockGooglePayload.email,
        firstName: mockGooglePayload.given_name,
        lastName: mockGooglePayload.family_name,
        isEmailConfirmed: true
      });

      const response = await app
        .post('/auth/google')
        .send({ idToken: 'valid_google_token' });

      expect(response.status).toBe(200);
    });

    it('should handle expired Google token', async () => {
      OAuth2Client.prototype.verifyIdToken.mockRejectedValue(
        new Error('Token expired')
      );
      
      const response = await app
        .post('/auth/google')
        .send({ idToken: 'expired_token' });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_GOOGLE_TOKEN');
    });

    it('should handle invalid token format', async () => {
      const response = await app
        .post('/auth/google')
        .send({ idToken: 'invalid_format' });

      expect(response.status).toBe(401);
    });

    it('should preserve user data between logins', async () => {
      await app
        .post('/auth/google')
        .send({ idToken: 'valid_google_token' });

      const user = await User.findOne({ email: mockGooglePayload.email });
      await User.updateOne(
        { _id: user._id },
        { $set: { professionalSummary: 'Test summary' }}
      );

      const response = await app
        .post('/auth/google')
        .send({ idToken: 'valid_google_token' });

      expect(response.status).toBe(200);
      
      const updatedUser = await User.findOne({ email: mockGooglePayload.email });
      expect(updatedUser.professionalSummary).toBe('Test summary');
    });

    it('should handle network errors during Google verification', async () => {
      OAuth2Client.prototype.verifyIdToken.mockRejectedValue(
        new Error('Network error')
      );
      
      const response = await app
        .post('/auth/google')
        .send({ idToken: 'valid_token' });

      expect(response.status).toBe(500);
    });
  })

  describe('Gmail Auth endpoint', () => {
    it('should return 401 for invalid Gmail token', async () => {
      OAuth2Client.prototype.verifyIdToken.mockRejectedValue(new Error())
      
      const response = await app
        .post('/auth/google')
        .send({ idToken: 'invalid_token' })

      expect(response.status).toBe(401)
      expect(response.body.code).toBe('INVALID_GMAIL_TOKEN')
    })
  })
})
