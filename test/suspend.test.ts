import { createConnection, getConnection, getRepository } from 'typeorm';
import express, { Express } from 'express';
import request from 'supertest';
import router from '../src/router';
import { Student } from '../src/entity/Student';
import bodyParser from 'body-parser';

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
    app = express().use(bodyParser.json()).use('/api', router);
    await seed();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  it('should respond 400 when no request body', async () => {
    const res = await request(app).post('/api/suspend').send();
    expect(res.status).toBe(400);
  });

  it('should respond 400 when param is invalid email', async () => {
    const res = await request(app)
      .post('/api/suspend')
      .send({ student: 'invalid@email' });
    expect(res.status).toBe(400);
  });

  it('should respond 404 when student does not exist', async () => {
    const res = await request(app)
      .post('/api/suspend')
      .send({ student: 'studenthon@gmail.com' });
    expect(res.status).toBe(404);
  });

  it('should respond 204 on success', async () => {
    const res = await request(app)
      .post('/api/suspend')
      .send({ student: 'studentjon@gmail.com' });
    expect(res.status).toBe(204);
  });
});
