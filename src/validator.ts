import { NextFunction, Request, Response } from 'express';
const { body, query, validationResult } = require('express-validator');

const validationErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid parameter' });
  } else {
    next();
  }
};

const registerValidator = [
  body('teacher').isEmail(),
  body('students').isArray({ min: 1 }),
  body('students.*').isEmail(),
  validationErrorHandler,
];

const commonStudentsValidator = [
  (req: Request, res: Response, next: NextFunction) => {
    req.query.teacher = Array.isArray(req.query.teacher)
      ? req.query.teacher
      : ([req.query.teacher] as string[]);
    next();
  },
  query('teacher').isArray({ min: 1 }),
  query('teacher.*').isEmail(),
  validationErrorHandler,
];

const suspendValidator = [body('student').isEmail(), validationErrorHandler];

const retrieveForNotificationsValidator = [
  body('teacher').isEmail(),
  body('notification').isString(),
  validationErrorHandler,
];

export {
  registerValidator,
  commonStudentsValidator,
  suspendValidator,
  retrieveForNotificationsValidator,
};
