const request = require('supertest');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');
const CourseRegister = require('../src/models/courseRegisterModel');
const { createUser, createCourse, createCourseRegister } = require('./helpers/factories');

const app = buildTestApp();

describe('POST /api/paid', () => {
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

  test('sikeres eset a paid mezőt igazra állítja', async () => {
    const register = await createCourseRegister({
      userId: user.id,
      courseId: course.id,
      paid: false,
    });

    const res = await request(app)
      .post('/api/paid')
      .send({ CourseRegisterId: register.id });

    expect(res.status).toBe(200);

    await register.reload();
    expect(register.paid).toBe(true);
  });

  test('már fizetett regisztrációnál 201-et ad "Már fizettél" üzenettel', async () => {
    const register = await createCourseRegister({
      userId: user.id,
      courseId: course.id,
      paid: true,
    });

    const res = await request(app)
      .post('/api/paid')
      .send({ CourseRegisterId: register.id });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Már fizettél');
  });

  test('nem létező CourseRegisterId esetén 404-et ad', async () => {
    const res = await request(app)
      .post('/api/paid')
      .send({ CourseRegisterId: 999999999 });

    expect(res.status).toBe(404);
  });
});
