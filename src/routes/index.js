const router = require('express').Router()

const auth = require('~/routes/auth')
const user = require('~/routes/user')
const email = require('~/routes/email')
const adminInvitation = require('~/routes/adminInvitation')
const question = require('~/routes/question')
const resourcesCategory = require('~/routes/resourcesCategory')
const offer = require('~/routes/offer')
const category = require('~/routes/category')
const country = require('~/routes/countries')
const uploadRoutes = require('~/routes/uploadPhoto')
const subject = require('~/routes/subject')
const languageRoutes = require('~/routes/languageRoutes');

router.use('/auth', auth)
router.use('/users', user)
router.use('/send-email', email)
router.use('/admin-invitations', adminInvitation)
router.use('/questions', question)
router.use('/resources-categories', resourcesCategory)
router.use('/offers', offer)
router.use('/categories', category)
router.use('/countries', country)
router.use('/upload', uploadRoutes)
router.use('/subjects', subject)
router.use('/api/languages', languageRoutes);

module.exports = router
