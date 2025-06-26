const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
require('dotenv').config();

const app = express();

// Templating
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
