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
app.use('/', express.static(termeszetBuildPath));
// Csak a galéria-mappa publikus: az uploads/ gyökerében a kurzusvideók vannak, azokat
// kizárólag a jogosultság-ellenőrző /api/video/:filename végpont szolgálhatja ki.
app.use('/uploads/gallery', express.static(galleryUploadsDir));

app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);

// Hibakezelő middleware (Multer, token és általános szerverhibák JSON formátumban)
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err);
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: `Feltöltési hiba: ${err.message}` });
  }
  res.status(err.status || 500).json({ error: err.message || 'Szerverhiba történt.' });
});

// SPA fallback: minden nem-API GET kérés (pl. /courses közvetlen megnyitása vagy
// frissítése) az index.html-t kapja, hogy a React Router kliens oldalon tudja kezelni.
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(termeszetBuildPath, 'index.html'));
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
