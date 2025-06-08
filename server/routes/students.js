const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { authenticateAdmin } = require('../middleware/auth');
const ExcelProcessor = require('../services/excelProcessor');
const database = require('../config/database');
const router = express.Router();

// Initialize Excel processor
const excelProcessor = new ExcelProcessor(database);

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await database.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student by student number
router.get('/number/:studentNumber', [
  param('studentNumber').notEmpty().withMessage('Student number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentNumber } = req.params;
    const studentData = await excelProcessor.getStudentDataForExport(studentNumber);
    
    if (!studentData) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(studentData);
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ error: 'Failed to fetch student data' });
  }
});

// Search students
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    // This is a simple search - in production you might want to use FTS
    const students = await database.getAllStudents();
    const searchTerm = q.toLowerCase().trim();
    
    const filteredStudents = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm) ||
      student.student_number.toLowerCase().includes(searchTerm) ||
      (student.section && student.section.toLowerCase().includes(searchTerm))
    );

    res.json(filteredStudents);
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ error: 'Failed to search students' });
  }
});

// Create new student (admin only)
router.post('/', 
  authenticateAdmin,
  [
    body('student_number').notEmpty().withMessage('Student number is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('section').optional(),
    body('email').optional().isEmail().withMessage('Invalid email format')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const studentData = req.body;
      
      // Check if student already exists
      const existingStudent = await database.getStudentByNumber(studentData.student_number);
      if (existingStudent) {
        return res.status(409).json({ error: 'Student with this number already exists' });
      }

      const newStudent = await database.createStudent(studentData);
      res.status(201).json(newStudent);

    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({ error: 'Failed to create student' });
    }
  }
);

// Update student (admin only)
router.put('/:id',
  authenticateAdmin,
  [
    param('id').isInt().withMessage('Invalid student ID'),
    body('name').notEmpty().withMessage('Name is required'),
    body('section').optional(),
    body('email').optional().isEmail().withMessage('Invalid email format')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const studentData = req.body;

      const result = await database.updateStudent(id, studentData);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json({ message: 'Student updated successfully' });

    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ error: 'Failed to update student' });
    }
  }
);

// Get student data by ID
router.get('/:id/data', [
  param('id').isInt().withMessage('Invalid student ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { worksheet_id } = req.query;

    const studentData = await database.getStudentData(
      parseInt(id), 
      worksheet_id ? parseInt(worksheet_id) : null
    );

    res.json(studentData);

  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ error: 'Failed to fetch student data' });
  }
});

module.exports = router;