// Tartalomfordítások: entitásonként egy-egy fordítási tábla (service_translations,
// course_translations, lesson_translations, gallery_translations). A magyar (alapnyelv)
// szöveg továbbra is az eredeti táblában van -- itt csak a többi nyelv él, nyelvenként egy
// sorral (UNIQUE <entitás>Id + lang). A `sourceHash` annak a magyar szövegnek a hash-e,
// amiből a fordítás készült: ha azóta a magyar megváltozott, a fordítás "elavult".
//
// Az FK constraint-eket (ON DELETE CASCADE) az associations.js köti be.
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Entitásonként a fordítható mezők és típusuk (a mezőnevek megegyeznek az eredeti tábláéval).
const TRANSLATABLE_FIELDS = {
  service: {
    title: { type: DataTypes.STRING(255), maxLength: 255 },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.STRING(100), maxLength: 100 },
    duration: { type: DataTypes.STRING(100), maxLength: 100 },
  },
  course: {
    cim: { type: DataTypes.STRING(255), maxLength: 255 },
    temakor: { type: DataTypes.STRING(255), maxLength: 255 },
    helyszin: { type: DataTypes.STRING(255), maxLength: 255 },
    leiras: { type: DataTypes.TEXT },
    szoveg: { type: DataTypes.TEXT },
  },
  lesson: {
    cim: { type: DataTypes.STRING(255), maxLength: 255 },
    szoveg: { type: DataTypes.TEXT },
  },
  gallery: {
    title: { type: DataTypes.STRING(255), maxLength: 255 },
  },
};

const defineTranslationModel = (entity, tableName, foreignKey) =>
  sequelize.define(
    `${entity}Translation`,
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      [foreignKey]: { type: DataTypes.INTEGER, allowNull: false },
      lang: { type: DataTypes.STRING(10), allowNull: false },
      ...Object.fromEntries(
        Object.entries(TRANSLATABLE_FIELDS[entity]).map(([field, spec]) => [field, { type: spec.type, allowNull: true }])
      ),
      sourceHash: { type: DataTypes.CHAR(64), allowNull: true },
    },
    {
      tableName,
      timestamps: true,
      indexes: [{ unique: true, fields: [foreignKey, 'lang'], name: `uq_${tableName}_${foreignKey}_lang` }],
    }
  );

const ServiceTranslation = defineTranslationModel('service', 'service_translations', 'serviceId');
const CourseTranslation = defineTranslationModel('course', 'course_translations', 'courseId');
const LessonTranslation = defineTranslationModel('lesson', 'lesson_translations', 'lessonId');
const GalleryTranslation = defineTranslationModel('gallery', 'gallery_translations', 'galleryId');

module.exports = {
  TRANSLATABLE_FIELDS,
  ServiceTranslation,
  CourseTranslation,
  LessonTranslation,
  GalleryTranslation,
};
