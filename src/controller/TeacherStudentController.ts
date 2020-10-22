import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { TeacherStudent } from '../entity/TeacherStudent';

export class TeacherStudentController {
  private teacherStudentRepository = getRepository(TeacherStudent);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.teacherStudentRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.teacherStudentRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    return this.teacherStudentRepository.save(request.body);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const userToRemove = await this.teacherStudentRepository.findOne(
      request.params.id
    );
    await this.teacherStudentRepository.remove(userToRemove);
  }
}
