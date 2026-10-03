// Tartalomfordítások (szolgáltatás, kurzus, lecke, galéria) végponttól végpontig: admin
// mentés validálással, állapotok (missing/partial/outdated/complete), publikus ?lang=
// lekérés magyar fallbackkel, kaszkád törlés. Lásd src/helpers/contentTranslations.js.
const request = require('supertest');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');
const Lesson = require('../src/models/lessonModel');
const Service = require('../src/models/serviceModel');
const Gallery = require('../src/models/galleryModel');
const { ServiceTranslation, CourseTranslation, LessonTranslation } = require('../src/models/translationModels');
const { createAdmin, createCourse, createLesson, generateToken } = require('./helpers/factories');

const app = buildTestApp();

describe('Tartalomfordítások', () => {
  let admin;
  let auth;
  const createdServiceIds = [];

  beforeAll(async () => {
    ({ user: admin } = await createAdmin());
    auth = { Authorization: `Bearer ${generateToken(admin)}` };
  });

  afterAll(async () => {
    await Service.destroy({ where: { id: createdServiceIds } });
    await User.destroy({ where: { id: admin.id } });
  });

  const createService = (body) =>
    request(app).post('/api/admin/services').set(auth).send({ isStarred: true, ...body });

  describe('szolgáltatás', () => {
    test('létrehozás fordítással -> publikus angol lekérés, hiányzó mező magyarul (fallback)', async () => {
      const res = await createService({
        title: 'Talpmasszázs teszt',
        description: 'Magyar leírás',
        duration: '60 perc',
        translations: { en: { title: 'Foot massage test', duration: '60 minutes' } },
      });
      expect(res.status).toBe(201);
      createdServiceIds.push(res.body.id);
      expect(res.body.title).toBe('Talpmasszázs teszt');
      expect(res.body.translations.en).toMatchObject({ title: 'Foot massage test', status: 'partial' });

      const en = await request(app).get('/api/services?lang=en');
      const item = en.body.find((s) => s.id === res.body.id);
      expect(item).toMatchObject({ title: 'Foot massage test', description: 'Magyar leírás', duration: '60 minutes' });
      expect(item.i18n).toEqual({ lang: 'en', fallback: ['description'] });
      expect(item.translations).toBeUndefined();

      const hu = await request(app).get('/api/services');
      expect(hu.body.find((s) => s.id === res.body.id)).toMatchObject({ title: 'Talpmasszázs teszt', i18n: { lang: 'hu', fallback: [] } });

      const unknown = await request(app).get('/api/services/featured?lang=xx');
      expect(unknown.body.find((s) => s.id === res.body.id).title).toBe('Talpmasszázs teszt');
    });

    test('állapotok: complete -> magyar módosítás után outdated -> naprakésznek jelölve complete', async () => {
      const created = await createService({
        title: 'Állapot teszt',
        description: 'Eredeti leírás',
        translations: { en: { title: 'Status test', description: 'Original description' } },
      });
      createdServiceIds.push(created.body.id);
      expect(created.body.translations.en.status).toBe('complete');

      // A magyar változik, a (változatlan) angol fordítás is visszaküldve -> elavult marad
      const changed = await request(app)
        .put(`/api/admin/services/${created.body.id}`)
        .set(auth)
        .send({
          description: 'Átírt leírás',
          translations: { en: { title: 'Status test', description: 'Original description' } },
        });
      expect(changed.status).toBe(200);
      expect(changed.body.translations.en.status).toBe('outdated');

      const reviewed = await request(app)
        .put(`/api/admin/services/${created.body.id}`)
        .set(auth)
        .send({ translations: { en: { markUpToDate: true } } });
      expect(reviewed.body.translations.en.status).toBe('complete');
      expect(reviewed.body.translations.en.description).toBe('Original description');

      // Az admin lista is ugyanígy mutatja
      const list = await request(app).get('/api/admin/services').set(auth);
      expect(list.body.find((s) => s.id === created.body.id).translations.en.status).toBe('complete');
    });

    test('minden mező kiürítése törli a fordítást (missing)', async () => {
      const created = await createService({
        title: 'Törlés teszt',
        description: 'Leírás',
        translations: { en: { title: 'Delete test' } },
      });
      createdServiceIds.push(created.body.id);
      const cleared = await request(app)
        .put(`/api/admin/services/${created.body.id}`)
        .set(auth)
        .send({ translations: { en: { title: '' } } });
      expect(cleared.body.translations.en).toMatchObject({ title: '', status: 'missing' });
      expect(await ServiceTranslation.count({ where: { serviceId: created.body.id } })).toBe(0);
    });

    test('multipart űrlap: a translations JSON-stringként is jöhet', async () => {
      const res = await request(app)
        .post('/api/admin/services')
        .set(auth)
        .field('title', 'Multipart teszt')
        .field('description', 'Leírás')
        .field('translations', JSON.stringify({ en: { title: 'Multipart test' } }));
      expect(res.status).toBe(201);
      createdServiceIds.push(res.body.id);
      expect(res.body.translations.en.title).toBe('Multipart test');
    });

    test('érvénytelen bemenet: ismeretlen nyelv, az alapnyelv, túl hosszú érték, hibás JSON -> 400, nem jön létre semmi', async () => {
      const before = await Service.count();
      for (const translations of [
        { xx: { title: 'X' } },
        { hu: { title: 'X' } },
        { en: { title: 'x'.repeat(256) } },
        { en: { title: 42 } },
        '{nem json',
      ]) {
        const res = await createService({ title: 'Hibás', description: 'Leírás', translations });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('generic.invalidData');
      }
      expect(await Service.count()).toBe(before);
    });

    test('szolgáltatás törlésekor a fordításai is törlődnek (ON DELETE CASCADE)', async () => {
      const created = await createService({
        title: 'Kaszkád teszt',
        description: 'Leírás',
        translations: { en: { title: 'Cascade test' } },
      });
      expect(await ServiceTranslation.count({ where: { serviceId: created.body.id } })).toBe(1);
      await request(app).delete(`/api/admin/services/${created.body.id}`).set(auth);
      expect(await ServiceTranslation.count({ where: { serviceId: created.body.id } })).toBe(0);
    });
  });

  describe('kurzus és lecke', () => {
    let course;
    let lesson;

    beforeAll(async () => {
      course = await createCourse({ cim: 'Magyar kurzus', leiras: 'Magyar kurzusleírás' });
      lesson = await createLesson({ courseId: course.id, cim: 'Első lecke', szoveg: 'Lecke szöveg' });
    });

    afterAll(async () => {
      await Course.destroy({ where: { id: course.id } });
    });

    test('kurzus és lecke fordítás mentése, publikus angol lekérés a leckékkel együtt', async () => {
      const upd = await request(app)
        .put('/api/admin/updateCourse')
        .set(auth)
        .send({ id: course.id, translations: { en: { cim: 'English course' } } });
      expect(upd.status).toBe(200);

      const lessonUpd = await request(app)
        .put('/api/admin/updateLesson')
        .set(auth)
        .send({ id: lesson.id, translations: { en: { cim: 'First lesson', szoveg: 'Lesson text' } } });
      expect(lessonUpd.status).toBe(200);

      const one = await request(app).post('/api/course').send({ id: course.id, lang: 'en' });
      expect(one.body).toMatchObject({ cim: 'English course', leiras: 'Magyar kurzusleírás' });
      expect(one.body.i18n.fallback).toEqual(expect.arrayContaining(['leiras', 'szoveg']));
      expect(one.body.lessons[0]).toMatchObject({ cim: 'First lesson', szoveg: 'Lesson text', i18n: { lang: 'en', fallback: [] } });

      const list = await request(app).get('/api/courses?lang=en');
      expect(list.body.find((c) => c.id === course.id).cim).toBe('English course');

      const adminList = await request(app).post('/api/admin/courses').set(auth).send({});
      expect(adminList.body.find((c) => c.id === course.id).translations.en).toMatchObject({ cim: 'English course', status: 'partial' });

      const lessons = await request(app).post('/api/admin/lessons').set(auth).send({ courseId: course.id });
      expect(lessons.body[0].translations.en.status).toBe('complete');
    });

    test('kurzus létrehozása fordítással; kurzus törlésekor a kurzus- és leckefordítások is törlődnek', async () => {
      const res = await request(app)
        .post('/api/admin/createCourse')
        .set(auth)
        .send({
          cim: 'Új kurzus',
          helyszin: 'Online',
          idopont: '2026-12-01T10:00:00Z',
          ar: 5000,
          translations: { en: { cim: 'New course', helyszin: 'Online' } },
        });
      expect(res.status).toBe(201);
      const created = await Course.findOne({ where: { cim: 'Új kurzus' }, order: [['id', 'DESC']] });
      const createdLesson = await Lesson.create({ courseId: created.id, cim: 'L', sorrend: 0 });
      await LessonTranslation.create({ lessonId: createdLesson.id, lang: 'en', cim: 'L-en' });
      expect(await CourseTranslation.count({ where: { courseId: created.id } })).toBe(1);

      await created.destroy();
      expect(await CourseTranslation.count({ where: { courseId: created.id } })).toBe(0);
      expect(await LessonTranslation.count({ where: { lessonId: createdLesson.id } })).toBe(0);
    });
  });

  describe('galéria', () => {
    let image;

    beforeAll(async () => {
      image = await Gallery.create({ title: 'Rendelő', filename: 'x.jpg', originalUrl: '/uploads/gallery/x.jpg' });
    });

    afterAll(async () => {
      await image.destroy();
    });

    test('képcím fordítása, publikus angol lista', async () => {
      const res = await request(app)
        .put(`/api/admin/gallery/${image.id}`)
        .set(auth)
        .send({ translations: { en: { title: 'Practice room' } } });
      expect(res.status).toBe(200);
      expect(res.body.image.translations.en).toMatchObject({ title: 'Practice room', status: 'complete' });

      const en = await request(app).get('/api/gallery?lang=en');
      expect(en.body.find((i) => i.id === image.id).title).toBe('Practice room');
      const hu = await request(app).get('/api/gallery');
      expect(hu.body.find((i) => i.id === image.id).title).toBe('Rendelő');
    });
  });
});
