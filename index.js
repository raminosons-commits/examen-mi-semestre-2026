const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./src/config/database');

const Student = require('./src/models/Student');
const Instructor = require('./src/models/Instructor');
const Course = require('./src/models/Course');
const Enrollment = require('./src/models/Enrollment');

const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

app.use(cors());

Student.hasMany(Enrollment, { foreignKey: 'student_id' });
Enrollment.belongsTo(Student, { foreignKey: 'student_id' });

Course.hasMany(Enrollment, { foreignKey: 'course_id' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id' });

Instructor.hasMany(Course, { foreignKey: 'instructor_id' });
Course.belongsTo(Instructor, { foreignKey: 'instructor_id' });

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', studentRoutes);
app.use('/api/v1', courseRoutes);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, message: 'API École de Formation en ligne' });
});

app.use(errorHandler);

sequelize.sync({ force: false })
  .then(() => console.log('Base de données synchronisée avec succès'))
  .catch(err => console.error('Erreur de synchronisation:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});