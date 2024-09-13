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
  origin: ['http://192.168.0.14:5000', 'http://localhost:5000', 'http://localhost:3000'], 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
};

app.use(cors(corsOptions));

const termeszetBuildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use('/', express.static(termeszetBuildPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(termeszetBuildPath, 'index.html'));
});

app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);


sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch(err => {
  console.error('Error synchronizing database', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
