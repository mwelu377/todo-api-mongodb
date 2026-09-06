const express = require('express');
const app = express();
const mongoose = require('mongoose');
const articleRoutes = require('./routes/articleRoutes');

require('dotenv').config();

app.use(express.json());

app.use('/articles', articleRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
  });