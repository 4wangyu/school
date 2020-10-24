import { createConnection, getConnection, getRepository } from 'typeorm';
import express, { Express } from 'express';
import request from 'supertest';
import router from '../src/router';
import { Student } from '../src/entity/Student';

const seed = async () => {
  await getRepository(Student).save(new Student('studentjon@gmail.com', false));
};

describe('testing /api/suspend', () => {
  let app: Express;

  beforeAll(async () => {
    await createConnection({
      type: 'sqljs',
      database: new Uint8Array(),
      location: 'database',
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

  it('should respond 400 when no request body', () => {
    request(app).post('/api/suspend').send().expect(400);
  });

  it('should respond 400 when param is invalid email', () => {
    request(app)
      .post('/api/suspend')
      .send({ student: 'invalid@email' })
      .expect(400);
  });

  it('should respond 404 when student does not exist', () => {
    request(app)
      .post('/api/suspend')
      .send({ student: 'studenthon@gmail.com' })
      .expect(404);
  });

  it('should respond 204 on success', () => {
    request(app)
      .post('/api/suspend')
      .send({ student: 'studentjon@gmail.com' })
      .expect(204);
  });
});
