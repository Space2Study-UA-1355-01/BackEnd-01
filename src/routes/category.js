const router = require('express').Router()
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')

const categoryController = require('~/controllers/category')

router.get(
  '/',
  authMiddleware,
  restrictTo('student', 'tutor'),
  asyncWrapper(categoryController.getCategories)
)
router.get(
  '/:id/subjects/names',
  authMiddleware,
  restrictTo('student', 'tutor'),
  asyncWrapper(categoryController.getSubjectNamesByCategoryId)
);

module.exports = router
