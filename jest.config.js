module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setup/env.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
  // A tesztek egy közös, izolált MySQL teszt-DB-t (docker-compose.override.yml, -p
  // testbackend) osztanak meg egymás között -- párhuzamos futtatás versenyhelyzeteket
  // okozna (pl. két teszt-fájl egyszerre syncelné/törölné ugyanazokat a táblákat), ezért a
  // "test" npm script --runInBand-dal hívja a Jest-et.
  testTimeout: 15000,
  verbose: true,
};
