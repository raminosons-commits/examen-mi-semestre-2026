const sequelize = require('../config/database');
const Student = require('../models/Student');
const Instructor = require('../models/Instructor');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Base réinitialisée pour le seeding...');

    const students = await Student.bulkCreate([
      { name: 'Lindo', email: 'lindo@email.com', phone: '0340944412' },
      { name: 'Rija', email: 'rija@email.com', phone: '0321123453' },
      { name: 'Kezia', email: 'kezia@email.com', phone: '0321211345' },
      { name: 'Tino', email: 'tino@email.com', phone: '0344675423' }
    ], { returning: true });

    const instructors = await Instructor.bulkCreate([
      { name: 'Dr. Mathieu', email: 'mathieu@email.com', specialty: 'Informatique' },
      { name: 'Mme Theresa', email: 'theresa@email.com', specialty: 'Marketing' },
      { name: 'Mr. James', email: 'james@email.com', specialty: 'Design' }
    ], { returning: true });

    const courses = await Course.bulkCreate([
      { title: 'Node.js Avancé', description: 'Cours avancé Node.js', price: 150, duration_hours: 20, instructor_id: instructors[0].id },
      { title: 'React Native', description: 'Développement mobile', price: 200, duration_hours: 25, instructor_id: instructors[0].id },
      { title: 'Stratégie Digitale', description: 'Marketing digital', price: 100, duration_hours: 15, instructor_id: instructors[1].id },
      { title: 'UI/UX Design', description: 'Conception UI/UX', price: 120, duration_hours: 10, instructor_id: instructors[2].id },
      { title: 'Base de données SQL', description: 'SQL et modélisation', price: 90, duration_hours: 12, instructor_id: instructors[0].id }
    ], { returning: true });

    await Enrollment.bulkCreate([
      { student_id: students[0].id, course_id: courses[0].id, status: 'active', payment_status: 'paid' },
      { student_id: students[0].id, course_id: courses[1].id, status: 'pending', payment_status: 'unpaid' },
      { student_id: students[1].id, course_id: courses[0].id, status: 'active', payment_status: 'paid' },
      { student_id: students[2].id, course_id: courses[2].id, status: 'completed', payment_status: 'paid' },
      { student_id: students[3].id, course_id: courses[3].id, status: 'active', payment_status: 'paid' },
      { student_id: students[1].id, course_id: courses[4].id, status: 'pending', payment_status: 'unpaid' }
    ]);

    console.log('Données de test insérées avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding :', error);
    process.exit(1);
  }
}

seed();