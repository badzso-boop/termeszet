// Jest manuális mock a `nodemailer` csomaghoz. Mivel ez a fájl a projekt gyökerén
// (rootDir) belüli `__mocks__/nodemailer.js`-ben van, egy node_modules-beli csomaghoz,
// Jest automatikusan ezt használja MINDEN teszt-fájlban, explicit `jest.mock('nodemailer')`
// hívás nélkül — így az src/helpers/emailSender.js sosem próbál valódi SMTP-kapcsolatot
// nyitni a smtp.gmail.com felé teszt közben (ami lassítaná/instabillá tenné a suite-ot,
// és üres EMAIL_USER/EMAIL_PASS mellett úgyis hibázna).

const sendMail = jest.fn().mockResolvedValue({ messageId: 'mocked-message-id' });

const createTransport = jest.fn(() => ({
  sendMail,
}));

module.exports = { createTransport, __sendMail: sendMail };
