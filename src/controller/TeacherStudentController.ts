import { Request, Response } from 'express';
import { getManager, getRepository } from 'typeorm';
import { Student } from '../entity/Student';
import { Teacher } from '../entity/Teacher';
import { TeacherStudent } from '../entity/TeacherStudent';

function register(req: Request, res: Response) {
  const { teacher, students } = req.body;

  getManager()
    .transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(new Teacher(teacher));

      for (const student of students) {
        const savedStudent = await transactionalEntityManager.findOne(Student, {
          email: student,
        });
        if (!savedStudent) {
          await transactionalEntityManager.save(new Student(student, false));
        }

        const savedTeacherStudent = await transactionalEntityManager.findOne(
          TeacherStudent,
          {
            teacher,
            student,
          }
        );
        if (!savedTeacherStudent) {
          await transactionalEntityManager.save(
            new TeacherStudent(teacher, student)
          );
        }
      }
    })
    .then(() => res.status(204).json())
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: err });
    });
}

async function commonStudents(req: Request, res: Response) {
  const teacherStudentRepository = getRepository(TeacherStudent);
  const s = await teacherStudentRepository.find();
  res.json({ s });
}

async function retrieveStudentsForNotifications(req: Request, res: Response) {
  const teacherStudentRepository = getRepository(TeacherStudent);
  const s = await teacherStudentRepository.find();
  res.json({ s });
}

export { register, commonStudents, retrieveStudentsForNotifications };
