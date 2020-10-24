import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Student } from '../entity/Student';

const suspend = (req: Request, res: Response) => {
  const studentEmail = req.body.student;

  const studentRepository = getRepository(Student);
  studentRepository
    .findOne({ email: studentEmail })
    .then(async (student) => {
      if (student) {
        await studentRepository.update(student, { suspended: true });
        res.status(204).json();
      } else {
        res.status(404).json({ message: 'Student not found' });
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: 'Internal error, please contact support' });
    });
};

export { suspend };
