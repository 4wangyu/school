import * as express from 'express';
import { suspend } from './controller/StudentController';
import {
  commonStudents,
  register,
  retrieveStudentsForNotifications,
} from './controller/TeacherStudentController';

const router = express.Router();

router.post('register', register);
router.get('commonstudents', commonStudents);
router.post('suspend', suspend);
router.post('retrievefornotifications', retrieveStudentsForNotifications);

export default router;
