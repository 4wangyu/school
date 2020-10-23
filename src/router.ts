import express from 'express';
import { suspend } from './controller/StudentController';
import {
  getCommonStudents,
  register,
  retrieveStudentsForNotifications,
} from './controller/TeacherStudentController';
import { registerValidator } from './validator';

const router = express.Router();

router.post('/register', registerValidator, register);
router.get('/commonstudents', getCommonStudents);
router.post('/suspend', suspend);
router.post('/retrievefornotifications', retrieveStudentsForNotifications);

export default router;
