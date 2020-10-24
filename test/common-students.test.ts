import express, { Express } from 'express';
import request from 'supertest';
import { createConnection, getConnection, getRepository } from 'typeorm';
import * as tsController from '../src/controller/TeacherStudentController';
import { Student } from '../src/entity/Student';
import { Teacher } from '../src/entity/Teacher';
import { TeacherStudent } from '../src/entity/TeacherStudent';
import router from '../src/router';

const seed = async () => {
  await getRepository(Teacher).save(new Teacher('teacherken@gmail.com'));
  await getRepository(Teacher).save(new Teacher('teacherjoe@gmail.com'));
  await getRepository(Student).save(new Student('studentjon@gmail.com', false));
  await getRepository(TeacherStudent).save(
    new TeacherStudent('teacherken@gmail.com', 'studentjon@gmail.com')
  );
  await getRepository(TeacherStudent).save(
    new TeacherStudent('teacherjoe@gmail.com', 'studentjon@gmail.com')
  );
};

describe('testing /api/commonstudents', () => {
  let app: Express;

  beforeAll(async () => {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      entities: ['src/entity/**/*.ts'],
      synchronize: true,
      logging: false,
    });
    app = express().use('/api', router);

    await seed();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  it('should respond 400 when no query param', () => {
    request(app).get('/api/commonstudents').send().expect(400);
  });

  it('should respond 400 when param is invalid email', () => {
    request(app).get('/api/commonstudents?teacher=invalid%40email').expect(400);
  });

  it('should respond 200 with empty array when no common students', async () => {
    const res = await request(app).get(
      '/api/commonstudents?teacher=teacherfoo%40gmail.com'
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ students: [] });
  });

  it('should respond 200 with common students', async () => {
    // sqlite only supports DISTINCT clause in SELECT statements, use mocking instead
    jest
      .spyOn(tsController, 'getCommonStudentEmails')
      .mockResolvedValue(['studentjon@gmail.com']);

    const res = await request(app).get(
      '/api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com'
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      students: ['studentjon@gmail.com'],
    });
  });
});
