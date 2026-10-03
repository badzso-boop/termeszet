const fs = require('fs');
const path = require('path');
const sequelize = require('../config/db');
const Service = require('../models/serviceModel');
const { ServiceTranslation } = require('../models/translationModels');
const {
  resolveLang,
  translationInclude,
  localize,
  adminView,
  parseTranslationsInput,
  saveTranslations,
} = require('../helpers/contentTranslations');

const SERVICE_ORDER = [
  ['order', 'ASC'],
  ['createdAt', 'ASC']
];

const findServicesForAdmin = (where = {}) =>
  Service.findAll({
    where,
    include: [{ model: ServiceTranslation, as: 'translations' }],
    order: SERVICE_ORDER
  }).then((services) => services.map((service) => adminView(service, 'service')));

const findServiceForAdmin = (id) =>
  Service.findByPk(id, { include: [{ model: ServiceTranslation, as: 'translations' }] })
    .then((service) => service && adminView(service, 'service'));

const saveServiceTranslations = (service, parsed, transaction) =>
  saveTranslations({
    TranslationModel: ServiceTranslation,
    foreignKey: 'serviceId',
    entity: 'service',
    record: service,
    parsed,
    transaction
  });

// Alapértelmezett kezdő szolgáltatások (ha a tábla üres lenne)
const defaultServices = [
  {
    title: 'Kombinált Kezelés',
    description: 'Reflexológia és energetikai kezelés az egész testre, amellyel a testi blokkok oldása mellett a lelket és a belső energiákat harmonizáljuk.',
    iconType: 'hands',
    isStarred: true,
    order: 1
  },
  {
    title: 'Vérreflexológia',
    description: 'A vérkeringést, nyirokkeringést és a testnedvek optimális áramlását serkentő, célzott kezelés, amely elősegíti a sejtek oxigén- és tápanyagellátását, a méregtelenítést és az érhálózat megújulását.',
    iconType: 'heart',
    isStarred: true,
    order: 2
  },
  {
    title: 'Életmódtanácsadás',
    description: 'Személyre szabott mély meditációval viszlek vissza a születés előtti állapotodhoz és mutatom be a jelenlegi életedhez illő folyamatokat, amivel az új életedet tudod felépíteni.',
    iconType: 'compass',
    isStarred: true,
    order: 3
  },
  {
    title: 'Táplálkozás és Energetikai Tanácsadás',
    description: 'A tested által mutatott folyamatoknak megfelelően adom az étrendet, testmozgást javaslok, életmegújító, gondolkodásmód-formáló gyakorlatokkal és munkafolyamatokkal építjük újjá az életedet.',
    iconType: 'seedling',
    isStarred: true,
    order: 4
  },
  {
    title: 'Lélekalkotás Kísérő (Forrás-kód®)',
    description: 'Ezen a foglalkozáson egyénileg kérheted, hogy egy új személyiséget hozzunk létre a te eredendő lélekprogramodnak megfelelően.',
    iconType: 'spa',
    isStarred: true,
    order: 5
  },
  {
    title: 'Talpreflexológia',
    description: 'A talpon keresztül a test jelzéseivel dolgozva teret adunk annak, hogy a régi feszültségek, blokkok és lenyomatok finoman elkezdhessenek oldódni.',
    iconType: 'feet',
    isStarred: true,
    order: 6
  }
];

// Automatikus kezdőadat-feltöltés ha üres a tábla
async function seedDefaultServicesIfNeeded() {
  try {
    const count = await Service.count();
    if (count === 0) {
      await Service.bulkCreate(defaultServices);
      console.log('Alapértelmezett szolgáltatások inicializálva az adatbázisban.');
    }
  } catch (err) {
    console.error('Hiba az alapértelmezett szolgáltatások seedelése során:', err.message);
  }
}

// 1. Publikus: összes szolgáltatás lekérése (?lang=en -> angolul, ahol nincs fordítás, magyarul)
exports.getServices = async (req, res) => {
  try {
    await seedDefaultServicesIfNeeded();
    const lang = resolveLang(req.query.lang);
    const services = await Service.findAll({
      include: translationInclude(ServiceTranslation, lang),
      order: SERVICE_ORDER
    });
    res.json(services.map((service) => localize(service, 'service', lang)));
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'service.fetchFailed' });
  }
};

// 2. Publikus: csak a csillagozott (főoldali) szolgáltatások lekérése
exports.getFeaturedServices = async (req, res) => {
  try {
    await seedDefaultServicesIfNeeded();
    const lang = resolveLang(req.query.lang);
    const services = await Service.findAll({
      where: { isStarred: true },
      include: translationInclude(ServiceTranslation, lang),
      order: SERVICE_ORDER
    });
    res.json(services.map((service) => localize(service, 'service', lang)));
  } catch (error) {
    console.error('Error fetching featured services:', error);
    res.status(500).json({ error: 'service.fetchFeaturedFailed' });
  }
};

// Admin: összes szolgáltatás a magyar mezőkkel és nyelvenkénti fordításokkal + állapottal
exports.getServicesAdmin = async (req, res) => {
  try {
    await seedDefaultServicesIfNeeded();
    res.json(await findServicesForAdmin());
  } catch (error) {
    console.error('Error fetching services for admin:', error);
    res.status(500).json({ error: 'service.fetchFailed' });
  }
};

// 3. Admin: Új szolgáltatás létrehozása (opcionálisan fordításokkal: `translations` mező)
exports.createService = async (req, res) => {
  try {
    const { title, description, price, duration, isStarred, iconType, order } = req.body;
    const translations = parseTranslationsInput(req.body.translations, 'service');

    if (!title || !description) {
      return res.status(400).json({ error: 'service.titleAndDescriptionRequired' });
    }

    let iconUrl = null;
    if (req.file) {
      iconUrl = `/uploads/gallery/${req.file.filename}`;
    } else if (req.body.iconUrl) {
      iconUrl = req.body.iconUrl;
    }

    const maxOrderService = await Service.findOne({
      order: [['order', 'DESC']]
    });
    const nextOrder = order !== undefined ? parseInt(order, 10) : (maxOrderService ? maxOrderService.order + 1 : 1);

    const newService = await sequelize.transaction(async (transaction) => {
      const created = await Service.create({
        title: title.trim(),
        description: description.trim(),
        price: price ? price.trim() : null,
        duration: duration ? duration.trim() : null,
        iconUrl: iconUrl,
        iconType: iconType || (iconUrl ? 'custom' : 'spa'),
        isStarred: isStarred === true || isStarred === 'true' || isStarred === '1',
        order: nextOrder
      }, { transaction });
      await saveServiceTranslations(created, translations, transaction);
      return created;
    });

    res.status(201).json(await findServiceForAdmin(newService.id));
  } catch (error) {
    if (error.messageKey) {
      return res.status(error.status).json({ error: error.messageKey });
    }
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'service.createFailed' });
  }
};

// 4. Admin: Szolgáltatás módosítása
exports.updateService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ error: 'service.notFound' });
    }

    const { title, description, price, duration, isStarred, iconType, order } = req.body;
    const translations = parseTranslationsInput(req.body.translations, 'service');

    if (title !== undefined) service.title = title.trim();
    if (description !== undefined) service.description = description.trim();
    if (price !== undefined) service.price = price ? price.trim() : null;
    if (duration !== undefined) service.duration = duration ? duration.trim() : null;
    if (iconType !== undefined) service.iconType = iconType;
    if (order !== undefined) service.order = parseInt(order, 10);
    if (isStarred !== undefined) {
      service.isStarred = isStarred === true || isStarred === 'true' || isStarred === '1';
    }

    // Új logó feltöltése esetén
    if (req.file) {
      service.iconUrl = `/uploads/gallery/${req.file.filename}`;
      service.iconType = 'custom';
    } else if (req.body.iconUrl !== undefined) {
      service.iconUrl = req.body.iconUrl;
    }

    await sequelize.transaction(async (transaction) => {
      await service.save({ transaction });
      await saveServiceTranslations(service, translations, transaction);
    });
    res.json(await findServiceForAdmin(service.id));
  } catch (error) {
    if (error.messageKey) {
      return res.status(error.status).json({ error: error.messageKey });
    }
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'service.updateFailed' });
  }
};

// 5. Admin: Csillag / főoldali kiemelés váltása
exports.toggleStarService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ error: 'service.notFound' });
    }

    service.isStarred = !service.isStarred;
    await service.save();

    res.json({ message: 'service.starUpdated', service });
  } catch (error) {
    console.error('Error toggling service star:', error);
    res.status(500).json({ error: 'service.starFailed' });
  }
};

// 6. Admin: Szolgáltatás törlése
exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ error: 'service.notFound' });
    }

    // Ha van egyedi feltöltött kép, opcionálisan törölhetjük a lemezről
    if (service.iconUrl && service.iconUrl.startsWith('/uploads/gallery/')) {
      const filePath = path.join(process.cwd(), service.iconUrl);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          // Ignore deletion error
        }
      }
    }

    await service.destroy();
    res.json({ message: 'service.deleted' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'service.deleteFailed' });
  }
};

// 7. Admin: Szolgáltatások sorrendezése
exports.reorderServices = async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, order }
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'generic.invalidData' });
    }

    for (const item of items) {
      if (item.id) {
        await Service.update(
          { order: parseInt(item.order, 10) || 0 },
          { where: { id: item.id } }
        );
      }
    }

    res.json(await findServicesForAdmin());
  } catch (error) {
    console.error('Error reordering services:', error);
    res.status(500).json({ error: 'service.reorderFailed' });
  }
};
