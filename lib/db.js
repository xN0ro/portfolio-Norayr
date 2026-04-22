import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'portfolio.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initTables();
  }
  return db;
}

// creates tables and adds default projects if db is empty
function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT,
      technologies TEXT NOT NULL,
      image TEXT DEFAULT '/images/placeholder-project.svg',
      github_url TEXT,
      live_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // check if we need to add the default projects
  const count = db.prepare('SELECT COUNT(*) as c FROM projects').get();
  if (count.c === 0) {
    const insert = db.prepare(`
      INSERT INTO projects (title, slug, description, long_description, technologies, image, github_url, live_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // upboard project
    insert.run(
      'UpBoard - Sales Queue Management',
      'upboard',
      'A real-time web app for managing customer ups and sales queue flow at a car dealership. Features queue logic, manager controls, and history tracking.',
      'UpBoard is a full-stack dealership management system I built to solve a real operational challenge: managing customer flow and sales queues in a fast-paced car dealership environment. The application features real-time queue management with Socket.IO for instant updates across all connected clients, shift-based queue logic ensuring fair distribution of customer ups, a comprehensive manager dashboard with controls for overriding queue positions, viewing sales history and performance metrics, and a clean, intuitive interface tailored specifically for dealership operations. The system handles multiple user roles (sales, F&I, managers) each with role-specific views and permissions. Data persistence is handled through SQLite with a Node.js/Express backend, making it lightweight yet reliable for daily dealership operations.',
      'Node.js,Express,SQLite,JavaScript,HTML,CSS,Socket.IO',
      '/images/placeholder-project.svg',
      'https://github.com/xN0ro',
      'https://upboardapp.com'
    );

    // it support stuff
    insert.run(
      'Dealership IT Support Solutions',
      'dealership-it',
      'Internal technology solutions and IT support for dealership operations including system troubleshooting, software configuration, and infrastructure setup.',
      'Working at Toyota Gatineau, I took on the responsibility of managing internal technology solutions alongside my sales role. This involved diagnosing and resolving hardware and software issues across the dealership — from workstations and printers to network connectivity and specialized dealership management software. I configured new employee workstations, set up peripherals, managed software updates, and provided technical training to staff. This project reflects my ability to combine technical problem-solving with practical business needs, ensuring minimal downtime and maximum productivity for the sales and service teams. My approach was always to document solutions and create simple guides for recurring issues, reducing the need for external IT support and saving the dealership both time and money.',
      'Windows,Software Configuration,Troubleshooting,Network Setup,Internal Systems',
      '/images/placeholder-project.svg',
      null,
      null
    );

    // web dev portfolio
    insert.run(
      'Web Development Portfolio Projects',
      'web-portfolio',
      'A collection of web development projects focused on practical business needs, clean design, and user-friendly functionality using modern frameworks.',
      'As a Computer Programming student at La Cité, I have been building a portfolio of web development projects that demonstrate my growing expertise in modern web technologies. These projects range from interactive single-page applications built with React to full-stack applications using Next.js and Node.js backends. Each project is designed with a focus on solving real-world problems — whether it is creating responsive layouts that work seamlessly across devices, implementing secure authentication systems, or building RESTful APIs that handle data efficiently. My goal with every project is to write clean, maintainable code while delivering polished user experiences. This portfolio itself, built with Next.js, Redux Toolkit, and SQLite, serves as a prime example of my full-stack development capabilities.',
      'React,Next.js,Node.js,Express,SQLite,JavaScript,CSS',
      '/images/placeholder-project.svg',
      'https://github.com/xN0ro',
      null
    );
  }
}

export default getDb;
