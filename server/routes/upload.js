const express = require('express');
const { upload, handleUploadError } = require('../middleware/upload');
const { authenticateAdmin } = require('../middleware/auth');
const ExcelProcessor = require('../services/excelProcessor');
const database = require('../config/database');
const router = express.Router();

// Initialize Excel processor
const excelProcessor = new ExcelProcessor(database);

// Upload Excel file endpoint
router.post('/excel', 
  authenticateAdmin,
  upload.single('excelFile'),
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log('File uploaded:', req.file.originalname);

      // Process the Excel file
      const results = await excelProcessor.processExcelFile(
        req.file.path,
        req.file.originalname
      );

      res.json({
        message: 'File processed successfully',
        results: results
      });

    } catch (error) {
      console.error('Upload processing error:', error);
      res.status(500).json({ 
        error: 'Failed to process uploaded file',
        details: error.message 
      });
    }
  }
);

// Get upload history
router.get('/history', authenticateAdmin, async (req, res) => {
  try {
    const history = await database.getUploadHistory();
    res.json(history);
  } catch (error) {
    console.error('Error fetching upload history:', error);
    res.status(500).json({ error: 'Failed to fetch upload history' });
  }
});

// Get worksheets
router.get('/worksheets', authenticateAdmin, async (req, res) => {
  try {
    const worksheets = await database.getWorksheets();
    res.json(worksheets);
  } catch (error) {
    console.error('Error fetching worksheets:', error);
    res.status(500).json({ error: 'Failed to fetch worksheets' });
  }
});

module.exports = router;