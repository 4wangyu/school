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
      res.status(500).json({ message: err.message });
    });
}

async function getCommonStudents(req: Request, res: Response) {
  const teachers = Array.isArray(req.query.teacher)
    ? req.query.teacher
    : [req.query.teacher];

  try {
    const students = await getRepository(TeacherStudent)
      .createQueryBuilder('ts')
      .select('ts.student')
      .where('ts.teacher IN (:teachers)', { teachers })
      .groupBy('ts.student')
      .having('count(distinct ts.teacher) = :len', { len: teachers.length })
      .getRawMany();

    res.status(200).json({ students: students.map((s) => s.studentEmail) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function retrieveStudentsForNotifications(req: Request, res: Response) {
  const teacherStudentRepository = getRepository(TeacherStudent);
  const s = await teacherStudentRepository.find();
  res.json({ s });
}

export { register, getCommonStudents, retrieveStudentsForNotifications };
