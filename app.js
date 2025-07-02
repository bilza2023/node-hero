require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const app = express();
const adminTcodeRoutes = require('./routes/admin/tcode');
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Session + Flash
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const galleryRoutes = require('./routes/gallery');
const commentRoutes = require('./routes/comments');

// Modular syllabus routes
// const syllabusTcodeRoutes = require('./routes/syllabus/tcode');
// const syllabusChapterRoutes = require('./routes/syllabus/chapter');
// const syllabusExerciseRoutes = require('./routes/syllabus/exercise');
// const syllabusQuestionRoutes = require('./routes/syllabus/question');

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', uploadRoutes);
app.use('/', galleryRoutes);
app.use('/', commentRoutes);

// Main syllabus module
// app.use('/syllabus', syllabusTcodeRoutes);
// app.use('/syllabus', syllabusChapterRoutes);
// app.use('/syllabus', syllabusExerciseRoutes);
// app.use('/syllabus', syllabusQuestionRoutes);

app.use('/admin/tcode', adminTcodeRoutes);

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Node Hero running on http://localhost:${PORT}`);
});
