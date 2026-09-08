// Ez a teszt eredetileg "characterization test"-ként íródott (lásd git history:
// tests/characterization.orphaned-registrations.test.js), amikor a `feature/backend-tests`
// ágponton még nem léteztek a Sequelize asszociációk, és egy user törlése árván hagyta a
// hozzá tartozó CourseRegister sorokat.
//
// A `feature/db-associations` branch main-be mergelése (src/models/associations.js) valódi
// adatbázis-szintű FK constraint-eket vezetett be `ON DELETE CASCADE` beállítással a
// User<->CourseRegister, Course<->CourseRegister és User<->Homework kapcsolatokra -- ez a
// teszt most már EZT az új, elvárt viselkedést ellenőrzi.

const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');
const CourseRegister = require('../src/models/courseRegisterModel');
// Az asszociációkat a tests/setup/jest.setup.js már betölti minden tesztfájlhoz, mielőtt a
// sync() lefutna -- itt nincs rá külön szükség, csak a modellekre magukra.
const { createUser, createCourse, createCourseRegister } = require('./helpers/factories');

describe('Cascade delete: FK constraint-ek a User/Course/CourseRegister között', () => {
  test('user törlésekor a hozzá tartozó CourseRegister sor is automatikusan törlődik', async () => {
    const { user } = await createUser();
    const course = await createCourse();
    const register = await createCourseRegister({ userId: user.id, courseId: course.id });

    await user.destroy();

    const deletedUser = await User.findByPk(user.id);
    expect(deletedUser).toBeNull();

    const cascadedRegister = await CourseRegister.findByPk(register.id);
    expect(cascadedRegister).toBeNull();

    await Course.destroy({ where: { id: course.id } });
  });

  test('kurzus törlésekor a hozzá tartozó CourseRegister sor is automatikusan törlődik', async () => {
    const { user } = await createUser();
    const course = await createCourse();
    const register = await createCourseRegister({ userId: user.id, courseId: course.id });

    await course.destroy();

    const deletedCourse = await Course.findByPk(course.id);
    expect(deletedCourse).toBeNull();

    const cascadedRegister = await CourseRegister.findByPk(register.id);
    expect(cascadedRegister).toBeNull();

    await User.destroy({ where: { id: user.id } });
  });
});
