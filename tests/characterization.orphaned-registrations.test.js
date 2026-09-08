// "Characterization test": a MAI, tényleges viselkedést dokumentálja, nem a kívánatosat.
//
// A branch ág-pontján (main @ 43c1639) a Sequelize modellek között NINCS definiálva
// asszociáció/FK cascade a User és a CourseRegister között (lásd src/models/*.js -- egyik
// modellben sincs `.hasMany`/`.belongsTo`/`onDelete: 'CASCADE'`). Emiatt egy user törlése
// ma NEM törli a hozzá tartozó CourseRegister sorokat -- azok árván maradnak.
//
// Ha ez a teszt egy jövőbeli merge (pl. `feature/db-associations` main-be kerülése) után
// megbukik, az azt jelenti, hogy a viselkedés megváltozott (cascade delete bekerült) -- ekkor
// ezt a tesztet frissíteni kell az ÚJ elvárt viselkedésre. Ez NEM ennek a feladatnak a
// része, csak a mai állapot dokumentálása.

const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');
const CourseRegister = require('../src/models/courseRegisterModel');
const { createUser, createCourse, createCourseRegister } = require('./helpers/factories');

describe('Characterization: user törlése ma NEM törli kaszkádban a CourseRegister sorokat', () => {
  test('a CourseRegister sor a userId-val életben marad a user törlése után (árva sor)', async () => {
    const { user } = await createUser();
    const course = await createCourse();
    const register = await createCourseRegister({ userId: user.id, courseId: course.id });

    await user.destroy();

    const stillThere = await CourseRegister.findByPk(register.id);
    expect(stillThere).not.toBeNull();
    expect(stillThere.userId).toBe(user.id);

    const deletedUser = await User.findByPk(user.id);
    expect(deletedUser).toBeNull();

    // takarítás -- ez a sor a mai kód mellett szándékosan árván marad, a teszt végén
    // manuálisan töröljük, hogy ne piszkítsa be a következő futtatásokat.
    await CourseRegister.destroy({ where: { id: register.id } });
    await Course.destroy({ where: { id: course.id } });
  });
});
