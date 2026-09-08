const request = require('supertest');
const bcrypt = require('bcryptjs');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const { uniqueEmail, uniqueUsername } = require('./helpers/factories');

const app = buildTestApp();

describe('POST /api/register', () => {
  const createdEmails = [];

  afterAll(async () => {
    if (createdEmails.length) {
      await User.destroy({ where: { email: createdEmails } });
    }
  });

  test('sikeres regisztráció 201-et ad és létrehozza a usert', async () => {
    const email = uniqueEmail('register');
    createdEmails.push(email);

    const res = await request(app).post('/api/register').send({
      email,
      pwd: 'TitkosJelszo123!',
      username: uniqueUsername('register'),
      fullName: 'Regisztráció Teszt',
    });

    expect(res.status).toBe(201);

    const created = await User.findOne({ where: { email } });
    expect(created).not.toBeNull();
    expect(created.rang).toBe('u');
  });

  test('a jelszó bcrypt-tel van hashelve, nem kerül plaintext-ben az adatbázisba', async () => {
    const email = uniqueEmail('hashcheck');
    createdEmails.push(email);
    const plainPassword = 'MegEgyTitkosJelszo!42';

    const res = await request(app).post('/api/register').send({
      email,
      pwd: plainPassword,
      username: uniqueUsername('hashcheck'),
      fullName: 'Hash Teszt',
    });

    expect(res.status).toBe(201);

    const created = await User.findOne({ where: { email } });
    expect(created.pwd).not.toBe(plainPassword);
    // bcrypt hash formátum: $2a$/$2b$ prefix
    expect(created.pwd).toMatch(/^\$2[aby]\$/);
    await expect(bcrypt.compare(plainPassword, created.pwd)).resolves.toBe(true);
  });

  test('hiányzó mezők esetén 400-at ad, és nem hoz létre usert', async () => {
    const email = uniqueEmail('missingfields');

    const res = await request(app).post('/api/register').send({
      email,
      // pwd, username, fullName hiányzik
    });

    expect(res.status).toBe(400);

    const created = await User.findOne({ where: { email } });
    expect(created).toBeNull();
  });

  test('már létező email esetén 400-at ad', async () => {
    const email = uniqueEmail('duplicate');
    createdEmails.push(email);

    const payload = {
      email,
      pwd: 'ElsoJelszo123!',
      username: uniqueUsername('duplicate1'),
      fullName: 'Első Regisztráció',
    };

    const first = await request(app).post('/api/register').send(payload);
    expect(first.status).toBe(201);

    const second = await request(app).post('/api/register').send({
      ...payload,
      username: uniqueUsername('duplicate2'),
    });

    expect(second.status).toBe(400);

    const count = await User.count({ where: { email } });
    expect(count).toBe(1);
  });
});
