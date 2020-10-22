import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { TeacherStudent } from '../entity/TeacherStudent';

async function register(req: Request, res: Response) {
  const teacherStudentRepository = getRepository(TeacherStudent);
  const s = await teacherStudentRepository.find();
  res.json({ s });
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
