import express, { Express } from 'express';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import * as tsController from '../src/controller/TeacherStudentController';
import router from '../src/router';

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
  });

  afterAll(async () => {
    await getConnection().close();
  });

  it('should respond 400 when no query param', async () => {
    const res = await request(app).get('/api/commonstudents').send();
    expect(res.status).toBe(400);
  });

  it('should respond 400 when param is invalid email', async () => {
    const res = await request(app).get(
      '/api/commonstudents?teacher=invalid%40email'
    );
    expect(res.status).toBe(400);
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
