const request = require('supertest');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');
const Lesson = require('../src/models/lessonModel');
const { createAdmin, createCourse, createLesson, generateToken } = require('./helpers/factories');

const app = buildTestApp();

describe('Admin - lecke CRUD (src/routes/adminRoutes.js + adminController.js)', () => {
  let admin;
  let adminToken;
  let course;

  beforeAll(async () => {
    ({ user: admin } = await createAdmin());
    adminToken = generateToken(admin);
    course = await createCourse();
  });

  afterAll(async () => {
    await Course.destroy({ where: { id: course.id } });
    await User.destroy({ where: { id: admin.id } });
  });

  test('createLesson: sikeres létrehozás', async () => {
    const res = await request(app)
      .post('/api/admin/createLesson')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('courseId', String(course.id))
      .field('cim', 'Első lecke')
      .field('sorrend', '1')
      .field('szoveg', 'Lecke tartalma');

    expect(res.status).toBe(201);

    const created = await Lesson.findOne({ where: { cim: 'Első lecke', courseId: course.id } });
    expect(created).not.toBeNull();
  });

  test('createLesson: nem létező courseId esetén 404-et ad', async () => {
    const res = await request(app)
      .post('/api/admin/createLesson')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('courseId', '999999999')
      .field('cim', 'Árva lecke');

    expect(res.status).toBe(404);
  });

  test('getLessons: sorrend szerint adja vissza a kurzus leckéit', async () => {
    const l2 = await createLesson({ courseId: course.id, cim: 'Második', sorrend: 2 });
    const l1 = await createLesson({ courseId: course.id, cim: 'Nulladik', sorrend: 0 });

    const res = await request(app)
      .post('/api/admin/lessons')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ courseId: course.id });

    expect(res.status).toBe(200);
    const ids = res.body.map((l) => l.id);
    expect(ids.indexOf(l1.id)).toBeLessThan(ids.indexOf(l2.id));
  });

  test('updateLesson: sikeres módosítás', async () => {
    const lesson = await createLesson({ courseId: course.id });

    const res = await request(app)
      .put('/api/admin/updateLesson')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('id', String(lesson.id))
      .field('cim', 'Frissített lecke cím');

    expect(res.status).toBe(200);

    await lesson.reload();
    expect(lesson.cim).toBe('Frissített lecke cím');
  });

  test('updateLesson: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .put('/api/admin/updateLesson')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('id', '999999999')
      .field('cim', 'Nem létezik');

    expect(res.status).toBe(404);
  });

  test('deleteLesson: sikeres törlés', async () => {
    const lesson = await createLesson({ courseId: course.id });

    const res = await request(app)
      .delete('/api/admin/deleteLesson')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: lesson.id });

    expect(res.status).toBe(200);

    const found = await Lesson.findByPk(lesson.id);
    expect(found).toBeNull();
  });

  test('kurzus törlésekor a hozzá tartozó leckék is automatikusan törlődnek (cascade)', async () => {
    const cascadeCourse = await createCourse();
    const lesson = await createLesson({ courseId: cascadeCourse.id });

    await cascadeCourse.destroy();

    const found = await Lesson.findByPk(lesson.id);
    expect(found).toBeNull();
  });
});
