const request = require('supertest');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');
const CourseRegister = require('../src/models/courseRegisterModel');
const { createUser, createCourse } = require('./helpers/factories');

const app = buildTestApp();

describe('POST /api/registercourse', () => {
  let user;
  let course;

  beforeAll(async () => {
    ({ user } = await createUser());
    course = await createCourse();
  });

  afterAll(async () => {
    await CourseRegister.destroy({ where: { userId: user.id } });
    await Course.destroy({ where: { id: course.id } });
    await User.destroy({ where: { id: user.id } });
  });

  test('első regisztráció sikeres, enabled:false-szal jön létre', async () => {
    const res = await request(app)
      .post('/api/registercourse')
      .send({ userId: user.id, courseId: course.id });

    expect(res.status).toBe(200);

    const register = await CourseRegister.findOne({
      where: { userId: user.id, courseId: course.id },
    });
    expect(register).not.toBeNull();
    expect(register.enabled).toBe(false);
  });

  test('duplikált regisztráció 201-et ad "already registered" üzenettel (jelenlegi, dokumentált viselkedés)', async () => {
    // A kódban ma ez a viselkedés: a duplikátum HTTP 201-et kap (nem 400/409-et), a
    // hívó szempontjából megtévesztő lehet, de ez a jelenlegi tényleges működés — ezt a
    // tesztet ne "javítsd", csak dokumentálja a mai állapotot.
    const res = await request(app)
      .post('/api/registercourse')
      .send({ userId: user.id, courseId: course.id });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/already registered/i);

    const count = await CourseRegister.count({
      where: { userId: user.id, courseId: course.id },
    });
    expect(count).toBe(1);
  });
});
