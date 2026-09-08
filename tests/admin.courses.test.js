const request = require('supertest');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');
const { createAdmin, createCourse } = require('./helpers/factories');

const app = buildTestApp();

describe('Admin - kurzus CRUD (src/routes/adminRoutes.js + adminController.js)', () => {
  let admin;
  const createdCourseIds = [];

  beforeAll(async () => {
    ({ user: admin } = await createAdmin());
  });

  afterAll(async () => {
    if (createdCourseIds.length) {
      await Course.destroy({ where: { id: createdCourseIds } });
    }
    await User.destroy({ where: { id: admin.id } });
  });

  test('createCourse: sikeres létrehozás (multipart/form-data, videó fájl nélkül)', async () => {
    // A createCourse route-on `upload.single('video')` fut le verifyAdmin ELŐTT (lásd
    // adminRoutes.js) -- multer akkor is helyesen tölti a req.body-t szöveges mezőkkel, ha
    // nincs csatolt fájl, ezért itt szándékosan nem csatolunk videót (elkerülve az
    // 'uploads/' könyvtár létét megkövetelő diskStorage-ot).
    const res = await request(app)
      .post('/api/admin/createCourse')
      .field('userId', String(admin.id))
      .field('cim', 'Új Kurzus')
      .field('helyszin', 'Online')
      .field('idopont', '2026-12-01T10:00:00Z')
      .field('ar', '15000')
      .field('temakor', 'egyeb')
      .field('leiras', 'Leírás')
      .field('szoveg', 'Szöveg');

    expect(res.status).toBe(201);

    const created = await Course.findOne({ where: { cim: 'Új Kurzus' } });
    expect(created).not.toBeNull();
    createdCourseIds.push(created.id);
  });

  test('updateCourse: sikeres módosítás', async () => {
    const course = await createCourse();
    createdCourseIds.push(course.id);

    const res = await request(app)
      .put('/api/admin/updateCourse')
      .field('userId', String(admin.id))
      .field('id', String(course.id))
      .field('cim', 'Frissített Cím');

    expect(res.status).toBe(200);

    await course.reload();
    expect(course.cim).toBe('Frissített Cím');
  });

  test('updateCourse: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .put('/api/admin/updateCourse')
      .field('userId', String(admin.id))
      .field('id', '999999999')
      .field('cim', 'Nem Létezik');

    expect(res.status).toBe(404);
  });

  test('deleteCourse: sikeres törlés', async () => {
    const course = await createCourse();

    const res = await request(app)
      .delete('/api/admin/deleteCourse')
      .send({ userId: admin.id, id: course.id });

    expect(res.status).toBe(200);

    const found = await Course.findByPk(course.id);
    expect(found).toBeNull();
  });

  test('deleteCourse: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .delete('/api/admin/deleteCourse')
      .send({ userId: admin.id, id: 999999999 });

    expect(res.status).toBe(404);
  });
});
