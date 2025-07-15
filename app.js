require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const app = express();

const adminTcodeRoutes    = require('./routes/admin/tcode');
const adminChapterRoutes  = require('./routes/admin/chapter');
const exerciseRoutes      = require('./routes/admin/exercise');
const questionRoutes      = require('./routes/admin/question');

const indexRoutes         = require('./routes/index');
const authRoutes          = require('./routes/auth');
const uploadRoutes        = require('./routes/upload');
const galleryRoutes       = require('./routes/gallery');
const commentRoutes       = require('./routes/comments');


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Session + Flash
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Attach flash data to views
app.use((req, res, next) => {
  res.locals.flash = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  next();
});

// View Engine
app.set('view engine', 'ejs');
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'player', 'views')
]);

// Routes
app.use('/admin/tcode', adminTcodeRoutes);
app.use('/admin/chapter', adminChapterRoutes);
app.use('/admin/exercise', exerciseRoutes);
app.use('/admin/question', questionRoutes);
app.use('/admin/uploadContent', require('./routes/admin/uploadContent'));


app.use('/player', require('./routes/player'));


app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', uploadRoutes);
app.use('/', galleryRoutes);
app.use('/', commentRoutes);

// Flash test
app.get('/test-flash', (req, res) => {
  req.flash('success', 'Flash test worked!');
  res.redirect('/admin/tcode');
});
// debugger;
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Node Hero running on http://localhost:${PORT}`);
});
