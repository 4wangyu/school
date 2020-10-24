import { createConnection, getConnection, getRepository } from 'typeorm';
import express, { Express } from 'express';
import request from 'supertest';
import router from '../src/router';
import { Student } from '../src/entity/Student';
import { Teacher } from '../src/entity/Teacher';
import { TeacherStudent } from '../src/entity/TeacherStudent';
import bodyParser from 'body-parser';

const seed = async () => {
  await getRepository(Teacher).insert(new Teacher('teacherken@gmail.com'));
  await getRepository(Student).insert(
    new Student('studentjon@gmail.com', false)
  );
  await getRepository(Student).insert(
    new Student('studenthon@gmail.com', false)
  );
  await getRepository(TeacherStudent).insert(
    new TeacherStudent('teacherken@gmail.com', 'studentjon@gmail.com')
  );
};

describe('testing /api/retrievefornotifications', () => {
  let app: Express;

  beforeAll(async () => {
    await createConnection({
      type: 'sqljs',
      database: new Uint8Array(),
      location: 'database',
      entities: ['src/entity/**/*.ts'],
      synchronize: true,
      logging: true,
    });
    app = express().use(bodyParser.json()).use('/api', router);
    await seed();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  it('should respond 400 when no request body', () => {
    request(app).post('/api/retrievefornotifications').send().expect(400);
  });

  it('should respond 400 when req body has wrong format', () => {
    request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: 'teacherken@gmail.com',
      })
      .expect(400);
  });

  it('should respond 200 with students registered under teacher', async () => {
    const res = await request(app).post('/api/retrievefornotifications').send({
      teacher: 'teacherken@gmail.com',
      notification: 'Hello students!',
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      recipients: ['studentjon@gmail.com'],
    });
  });

  // it('should respond 200 with mentioned students & students registered under teacher', async () => {
  //   const res = await request(app).post('/api/retrievefornotifications').send({
  //     teacher: 'teacherken@gmail.com',
  //     notification: 'Hello there @studenthon@gmail.com',
  //   });
  //   console.log(res.body);

  //   expect(res.status).toBe(200);
  //   expect(res.body).toEqual({
  //     recipients: ['studentjon@gmail.com', 'studenthon@gmail.com'],
  //   });
  // });
});
