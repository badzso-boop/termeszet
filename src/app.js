const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
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

const termeszetBuildPath = path.join(__dirname, '..', 'public');
app.use('/', express.static(termeszetBuildPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(termeszetBuildPath, 'index.html'));
});

app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);


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
