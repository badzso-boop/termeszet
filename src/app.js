const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
// Modell-asszociációk (FK constraint-ek a sync()-hez) — a route-ok modelleket
// betöltő require-jei után, de a sequelize.sync() hívás előtt kell lennie.
require('./models/associations');
const cors = require('cors');
const path = require('path');
const seo = require('./seo');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://109.122.217.162:3000', 'http://109.122.217.162:5000', 'https://termeszet.ujjweb.hu'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');
const galleryUploadsDir = path.join(uploadsDir, 'gallery');
if (!fs.existsSync(galleryUploadsDir)) {
  fs.mkdirSync(galleryUploadsDir, { recursive: true });
}

const termeszetBuildPath = path.join(__dirname, '..', 'public');

// SEO: sitemap/robots dinamikusan (a SITE_URL-lel és a közös útvonaltáblával), régi
// aliasok és záró perjeles URL-ek 301-gyel a kanonikus címre.
app.get('/sitemap.xml', (req, res) => res.type('application/xml').send(seo.sitemapXml()));
app.get('/robots.txt', (req, res) => res.type('text/plain').send(seo.robotsTxt()));
app.get(/^\/(?!api\/)/, (req, res, next) => {
  const target = seo.redirectFor(req.path);
  if (!target) return next();
  const query = req.originalUrl.slice(req.path.length);
  res.redirect(301, target + query);
});

// index: false -- a "/" se a nyers index.html-t kapja, hanem az SEO-tagekkel kiegészítettet
// (lásd az SPA fallbacket lent).
app.use('/', express.static(termeszetBuildPath, { index: false }));
// Csak a galéria-mappa publikus: az uploads/ gyökerében a kurzusvideók vannak, azokat
// kizárólag a jogosultság-ellenőrző /api/video/:filename végpont szolgálhatja ki.
app.use('/uploads/gallery', express.static(galleryUploadsDir));

app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);

// SPA fallback: minden nem-API GET kérés (pl. /courses közvetlen megnyitása vagy
// frissítése) az index.html-t kapja, hogy a React Router kliens oldalon tudja kezelni --
// az URL nyelvének megfelelő SEO-tagekkel, ismeretlen útvonalnál 404-es státusszal.
let indexTemplate = null;
app.get(/^\/(?!api\/).*/, (req, res, next) => {
  try {
    indexTemplate = indexTemplate || fs.readFileSync(path.join(termeszetBuildPath, 'index.html'), 'utf8');
  } catch (err) {
    return next(err);
  }
  const { status, html } = seo.renderPage(indexTemplate, req.path);
  res.status(status).type('html').send(html);
});

// Hibakezelő middleware: mindig i18n-kulcsot küld vissza (`{ error: <kulcs> }`), a belső
// hibaüzenetet csak naplózza -- a frontend fordítja a kulcsot a látogató nyelvére.
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err);
  if (err.name === 'MulterError') {
    const key = err.code === 'LIMIT_FILE_SIZE' ? 'upload.fileTooLarge' : 'upload.failed';
    return res.status(400).json({ error: key });
  }
  if (err.messageKey) {
    return res.status(err.status || 400).json({ error: err.messageKey });
  }
  const status = err.status || 500;
  res.status(status).json({ error: status < 500 ? 'generic.invalidData' : 'generic.error' });
});


async function syncDatabaseWithRetry(retries = 10, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.sync();
      console.log('Database synchronized');
      return;
    } catch (err) {
      console.error(`Error synchronizing database (attempt ${attempt}/${retries})`, err.message);
      if (attempt === retries) return;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

syncDatabaseWithRetry();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
