import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

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

export { registerValidator };
