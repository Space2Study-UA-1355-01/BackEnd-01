const router = require('express').Router();
const asyncWrapper = require('~/middlewares/asyncWrapper');
const { authMiddleware, restrictTo } = require('~/middlewares/auth');

const subjectController = require('~/controllers/subject');

router.get(
  '/',
  authMiddleware,
  restrictTo('student', 'tutor'),
  asyncWrapper(subjectController.getSubjects)
);
router.post(
  '/',
  authMiddleware,
  restrictTo('student'), 
  asyncWrapper(subjectController.createSubject)
);

router.get(
  '/:id',
  authMiddleware,
  restrictTo('student', 'tutor'),
  asyncWrapper(subjectController.getSubjectById)
);

module.exports = router;
