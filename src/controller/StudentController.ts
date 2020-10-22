import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Student } from '../entity/Student';

async function suspend(req: Request, res: Response) {
  const studentRepository = getRepository(Student);
  const s = await studentRepository.find();
  res.json({ s });
}

export { suspend };
