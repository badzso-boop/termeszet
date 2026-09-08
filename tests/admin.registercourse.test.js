const request = require('supertest');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');
const CourseRegister = require('../src/models/courseRegisterModel');
const { createAdmin, createUser, createCourse, createCourseRegister } = require('./helpers/factories');

const app = buildTestApp();

describe('Admin - kurzus-regisztráció kezelés (toggleRegisteredCourse / toggleRegisteredCourseAdminPaid)', () => {
  let admin;
  let user;
  let course;

  beforeAll(async () => {
    ({ user: admin } = await createAdmin());
    ({ user } = await createUser());
    course = await createCourse();
  });

  afterAll(async () => {
    await CourseRegister.destroy({ where: { userId: user.id } });
    await Course.destroy({ where: { id: course.id } });
    await User.destroy({ where: { id: [admin.id, user.id] } });
  });

  test('toggleRegisteredCourse: bekapcsolja az enabled mezőt (false -> true)', async () => {
    const register = await createCourseRegister({
      userId: user.id,
      courseId: course.id,
      enabled: false,
    });

    const res = await request(app)
      .post('/api/admin/toggleregistercourse')
      .send({ userId: admin.id, id: register.id });

    expect(res.status).toBe(200);

    await register.reload();
    expect(register.enabled).toBe(true);
  });

  test('toggleRegisteredCourse: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .post('/api/admin/toggleregistercourse')
      .send({ userId: admin.id, id: 999999999 });

    expect(res.status).toBe(404);
  });

  test('toggleRegisteredCourseAdminPaid: bekapcsolja az adminPaid mezőt (false -> true)', async () => {
    const register = await createCourseRegister({
      userId: user.id,
      courseId: course.id,
      adminPaid: false,
    });

    const res = await request(app)
      .post('/api/admin/adminpaid')
      .send({ userId: admin.id, CourseRegisterId: register.id });

    expect(res.status).toBe(200);

    await register.reload();
    expect(register.adminPaid).toBe(true);
  });

  test('toggleRegisteredCourseAdminPaid: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .post('/api/admin/adminpaid')
      .send({ userId: admin.id, CourseRegisterId: 999999999 });

    expect(res.status).toBe(404);
  });
});
