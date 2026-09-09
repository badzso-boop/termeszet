const request = require('supertest');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');
const CourseRegister = require('../src/models/courseRegisterModel');
const { createAdmin, createUser, createCourse, createCourseRegister, generateToken } = require('./helpers/factories');

const app = buildTestApp();

describe('Admin - kurzus-regisztráció kezelés (toggleRegisteredCourse / toggleRegisteredCourseAdminPaid)', () => {
  let admin;
  let adminToken;
  let user;
  let course;

  beforeAll(async () => {
    ({ user: admin } = await createAdmin());
    adminToken = generateToken(admin);
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
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: register.id });

    expect(res.status).toBe(200);

    await register.reload();
    expect(register.enabled).toBe(true);
  });

  test('toggleRegisteredCourse: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .post('/api/admin/toggleregistercourse')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: 999999999 });

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
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ CourseRegisterId: register.id });

    expect(res.status).toBe(200);

    await register.reload();
    expect(register.adminPaid).toBe(true);
  });

  test('toggleRegisteredCourseAdminPaid: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .post('/api/admin/adminpaid')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ CourseRegisterId: 999999999 });

    expect(res.status).toBe(404);
  });
});
