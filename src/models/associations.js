// Központi hely a modellek közötti Sequelize asszociációkhoz.
//
// Miért külön fájl: a modellek (userModel.js, courseModel.js, ...) egymástól
// függetlenül exportálnak egy-egy sequelize.define(...) eredményt. Ha maguknak
// a modell-fájloknak kellene egymást require-elniük az asszociációk
// definiálásához (pl. userModel.js require-elné a courseRegisterModel.js-t,
// az pedig vissza a userModel.js-t), az circular require-hez vezetne. Ehelyett
// ez a fájl importálja az összes modellt, és csak EZUTÁN köti össze őket — így
// a modell-fájlok maguk továbbra is függetlenek maradnak egymástól.
//
// FONTOS: ezt a fájlt az app.js-ben a modellek betöltése UTÁN, de a
// sequelize.sync() hívás ELŐTT kell require-elni, hogy a sync() már az itt
// definiált foreign key constraint-ekkel együtt generálja a táblákat.

const User = require('./userModel');
const Course = require('./courseModel');
const CourseRegister = require('./courseRegisterModel');
const Homework = require('./homeworkModel');
const Lesson = require('./lessonModel');
const Gallery = require('./galleryModel');
const Service = require('./serviceModel');
const {
  ServiceTranslation,
  CourseTranslation,
  LessonTranslation,
  GalleryTranslation,
} = require('./translationModels');

// User <-> CourseRegister (courseregister.userId -> users.id)
User.hasMany(CourseRegister, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
CourseRegister.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Course (minikurzus) <-> CourseRegister (courseregister.courseId -> minikurzus.id)
Course.hasMany(CourseRegister, {
  foreignKey: 'courseId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
CourseRegister.belongsTo(Course, {
  foreignKey: 'courseId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// User <-> Homework (homeworks.felhasznaloId -> users.id)
User.hasMany(Homework, {
  foreignKey: 'felhasznaloId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Homework.belongsTo(User, {
  foreignKey: 'felhasznaloId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Course (minikurzus) <-> Lesson (lessons.courseId -> minikurzus.id)
Course.hasMany(Lesson, {
  foreignKey: 'courseId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Lesson.belongsTo(Course, {
  foreignKey: 'courseId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Tartalomfordítások (lásd translationModels.js): <entitás> <-> <entitás>_translations,
// mindig `translations` aliasszal, hogy a controllerek egységesen include-olhassák.
[
  [Service, ServiceTranslation, 'serviceId'],
  [Course, CourseTranslation, 'courseId'],
  [Lesson, LessonTranslation, 'lessonId'],
  [Gallery, GalleryTranslation, 'galleryId'],
].forEach(([Model, TranslationModel, foreignKey]) => {
  Model.hasMany(TranslationModel, {
    as: 'translations',
    foreignKey,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  TranslationModel.belongsTo(Model, {
    foreignKey,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
});

module.exports = {
  User,
  Course,
  CourseRegister,
  Homework,
  Lesson,
  Gallery,
  Service,
  ServiceTranslation,
  CourseTranslation,
  LessonTranslation,
  GalleryTranslation,
};
