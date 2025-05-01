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
router.post(
  '/',
  authMiddleware,           
  restrictTo('admin'),       
  asyncWrapper(categoryController.createCategory)
);
router.get(
  '/names',
  authMiddleware,
  restrictTo('student', 'tutor'),
  asyncWrapper(categoryController.getCategoryNames)
);
router.get(
  '/:id/subjects/names',
  authMiddleware,
  restrictTo('student', 'tutor'),
  asyncWrapper(categoryController.getSubjectNamesByCategoryId)
);
router.get(
  '/:id', 
  authMiddleware, 
  restrictTo('student', 'tutor'), 
  asyncWrapper(categoryController.getCategoryById)
);
router.get(
  '/:id/subjects',
  authMiddleware,
  restrictTo('student', 'tutor'),
  asyncWrapper(categoryController.getSubjectsByCategoryId)
);
module.exports = router
