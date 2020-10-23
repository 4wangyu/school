import express from 'express';
import { suspend } from './controller/StudentController';
import {
  getCommonStudents,
  register,
  retrieveStudentsForNotifications,
} from './controller/TeacherStudentController';
import {
  commonStudentsValidator,
  registerValidator,
  retrieveForNotificationsValidator,
  suspendValidator,
} from './validator';

const router = express.Router();

router.post('/register', registerValidator, register);
router.get('/commonstudents', commonStudentsValidator, getCommonStudents);
router.post('/suspend', suspendValidator, suspend);
router.post(
  '/retrievefornotifications',
  retrieveForNotificationsValidator,
  retrieveStudentsForNotifications
);

export default router;
