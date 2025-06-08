const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = process.env.DB_PATH || './database/students.db';
  }

  async connect() {
    return new Promise((resolve, reject) => {
      // Ensure database directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.initializeTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async initializeTables() {
    return new Promise((resolve, reject) => {
      const tables = [
        // Students table
        `CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_number TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          section TEXT,
          email TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // Worksheets table (for different data categories)
        `CREATE TABLE IF NOT EXISTS worksheets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          file_name TEXT,
          total_records INTEGER DEFAULT 0
        )`,

        // Student data table (flexible key-value storage)
        `CREATE TABLE IF NOT EXISTS student_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER,
          worksheet_id INTEGER,
          data_key TEXT NOT NULL,
          data_value TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students (id),
          FOREIGN KEY (worksheet_id) REFERENCES worksheets (id)
        )`,

        // Upload history table
        `CREATE TABLE IF NOT EXISTS upload_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          file_name TEXT NOT NULL,
          original_name TEXT NOT NULL,
          file_size INTEGER,
          records_processed INTEGER,
          upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'completed'
        )`,

        // Admin users table
        `CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
      ];

      let completed = 0;
      tables.forEach((sql, index) => {
        this.db.run(sql, (err) => {
          if (err) {
            console.error(`Error creating table ${index}:`, err);
            reject(err);
          } else {
            completed++;
            if (completed === tables.length) {
              console.log('All database tables initialized');
              resolve();
            }
          }
        });
      });
    });
  }

  // Student operations
  async createStudent(studentData) {
    return new Promise((resolve, reject) => {
      const { student_number, name, section, email } = studentData;
      const sql = `INSERT INTO students (student_number, name, section, email) VALUES (?, ?, ?, ?)`;
      
      this.db.run(sql, [student_number, name, section, email], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...studentData });
        }
      });
    });
  }

  async getStudentByNumber(studentNumber) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM students WHERE student_number = ?`;
      this.db.get(sql, [studentNumber], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async getAllStudents() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM students ORDER BY name`;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async updateStudent(id, studentData) {
    return new Promise((resolve, reject) => {
      const { name, section, email } = studentData;
      const sql = `UPDATE students SET name = ?, section = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      
      this.db.run(sql, [name, section, email, id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }

  // Worksheet operations
  async createWorksheet(worksheetData) {
    return new Promise((resolve, reject) => {
      const { name, description, file_name, total_records } = worksheetData;
      const sql = `INSERT INTO worksheets (name, description, file_name, total_records) VALUES (?, ?, ?, ?)`;
      
      this.db.run(sql, [name, description, file_name, total_records], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...worksheetData });
      });
    });
  }

  async getWorksheets() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM worksheets ORDER BY upload_date DESC`;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Student data operations
  async saveStudentData(studentId, worksheetId, dataKey, dataValue) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT OR REPLACE INTO student_data (student_id, worksheet_id, data_key, data_value) VALUES (?, ?, ?, ?)`;
      
      this.db.run(sql, [studentId, worksheetId, dataKey, dataValue], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  }

  async getStudentData(studentId, worksheetId = null) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM student_data WHERE student_id = ?`;
      let params = [studentId];
      
      if (worksheetId) {
        sql += ` AND worksheet_id = ?`;
        params.push(worksheetId);
      }
      
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Upload history operations
  async saveUploadHistory(historyData) {
    return new Promise((resolve, reject) => {
      const { file_name, original_name, file_size, records_processed, status } = historyData;
      const sql = `INSERT INTO upload_history (file_name, original_name, file_size, records_processed, status) VALUES (?, ?, ?, ?, ?)`;
      
      this.db.run(sql, [file_name, original_name, file_size, records_processed, status], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...historyData });
      });
    });
  }

  async getUploadHistory() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM upload_history ORDER BY upload_date DESC LIMIT 50`;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) console.error('Error closing database:', err);
          else console.log('Database connection closed');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = new Database();