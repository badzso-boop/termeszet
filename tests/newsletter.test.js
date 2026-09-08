const request = require('supertest');
const buildTestApp = require('./helpers/testApp');
const NewsletterSubscriber = require('../src/models/newsletterModel');
const { uniqueEmail } = require('./helpers/factories');

const app = buildTestApp();

describe('POST /api/newsletter', () => {
  const createdEmails = [];

  afterAll(async () => {
    if (createdEmails.length) {
      await NewsletterSubscriber.destroy({ where: { email: createdEmails } });
    }
  });

  test('érvényes email esetén 201-et ad és létrehozza a feliratkozást', async () => {
    const email = uniqueEmail('newsletter');
    createdEmails.push(email);

    const res = await request(app).post('/api/newsletter').send({ email });

    expect(res.status).toBe(201);

    const subscriber = await NewsletterSubscriber.findOne({ where: { email } });
    expect(subscriber).not.toBeNull();
  });

  test('érvénytelen email esetén 400-at ad', async () => {
    const res = await request(app)
      .post('/api/newsletter')
      .send({ email: 'nem-egy-email-cim' });

    expect(res.status).toBe(400);
  });

  test('duplikált feliratkozás 200-at ad "már fel van iratkozva" üzenettel', async () => {
    const email = uniqueEmail('newsletter-dup');
    createdEmails.push(email);

    const first = await request(app).post('/api/newsletter').send({ email });
    expect(first.status).toBe(201);

    const second = await request(app).post('/api/newsletter').send({ email });
    expect(second.status).toBe(200);
    expect(second.body.message).toMatch(/már fel van iratkozva/i);

    const count = await NewsletterSubscriber.count({ where: { email } });
    expect(count).toBe(1);
  });
});
