import { createConnection, getConnection } from 'typeorm';
import express, { Express } from 'express';
import request from 'supertest';
import router from '../src/router';
import bodyParser from 'body-parser';

describe('testing /api/register', () => {
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
  });

  afterAll(async () => {
    await getConnection().close();
  });

  it('should respond 400 when no request body', async () => {
    const res = await request(app).post('/api/register').send();
    expect(res.status).toBe(400);
  });

  it('should respond 400 when param teacher is not valid email', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        teacher: 'invalid@email',
        students: ['studentjon@gmail.com', 'studenthon@gmail.com'],
      });
    expect(res.status).toBe(400);
  });

  it('should respond 400 when param students is empty array', async () => {
    const res = await request(app).post('/api/register').send({
      teacher: 'teacherken@gmail',
      students: [],
    });
    expect(res.status).toBe(400);
  });

  it('should respond 204 when request body is valid', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com', 'studenthon@gmail.com'],
      });
    expect(res.status).toBe(204);
  });
});
