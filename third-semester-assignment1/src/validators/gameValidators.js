const { body } = require('express-validator');

exports.validateCreateSession = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username required')
    .isLength({ min: 3, max: 20 })
];

exports.validateQuestion = [
  body('question')
    .trim()
    .notEmpty(),

  body('answer')
    .trim()
    .notEmpty()
];