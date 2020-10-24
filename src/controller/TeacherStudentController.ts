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
      res
        .status(500)
        .json({ message: 'Internal error, please contact support' });
    });
}

export const getCommonStudentEmails = async (
  teachers: string[]
): Promise<string[]> => {
  const students = await getRepository(TeacherStudent)
    .createQueryBuilder('ts')
    .select('ts.student')
    .where('ts.teacher IN (:teachers)', { teachers })
    .groupBy('ts.student')
    .having('count(distinct ts.teacher) = :len', { len: teachers.length })
    .getRawMany();
  return students.map((s) => s.studentEmail);
};

async function getCommonStudents(req: Request, res: Response) {
  const teachers = req.query.teacher as string[];

  try {
    const students = await getCommonStudentEmails(teachers);

    res.status(200).json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error, please contact support' });
  }
}

async function retrieveStudentsForNotifications(req: Request, res: Response) {
  const { teacher, notification } = req.body;

  const mentionedStudents = (
    notification.match(/@[A-Za-z0-9_\-.+]+@[A-Za-z0-9_\-.]+\.[A-Za-z]{2,}/g) ||
    []
  ).map((emailWithAt: string) => emailWithAt.slice(1));

  try {
    const mentionedUnsuspendedStudents = mentionedStudents.length
      ? await getRepository(Student)
          .createQueryBuilder('st')
          .select('st.email')
          .where('st.suspended = :suspended', { suspended: false })
          .andWhere('st.email IN (:students)', { students: mentionedStudents })
          .getMany()
      : [];

    const unsuspendedStudentsUnderTeacher = await getRepository(TeacherStudent)
      .createQueryBuilder('ts')
      .select('ts.student')
      .innerJoin('ts.student', 'st')
      .where('ts.teacher = :teacher', { teacher })
      .andWhere('st.suspended = :suspended', { suspended: false })
      .getRawMany();

    const recipients = new Set<string>([
      ...unsuspendedStudentsUnderTeacher.map((s) => s.studentEmail),
      ...mentionedUnsuspendedStudents.map((s) => s.email),
    ]);

    res.status(200).json({ recipients: Array.from(recipients) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error, please contact support' });
  }
}

export { register, getCommonStudents, retrieveStudentsForNotifications };
