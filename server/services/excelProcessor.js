const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

class ExcelProcessor {
  constructor(database) {
    this.db = database;
  }

  async processExcelFile(filePath, originalName) {
    try {
      console.log(`Processing Excel file: ${originalName}`);
      
      // Read the Excel file
      const workbook = XLSX.readFile(filePath);
      const worksheetNames = workbook.SheetNames;
      
      const results = {
        worksheets: [],
        totalRecords: 0,
        errors: []
      };

      // Process each worksheet
      for (const sheetName of worksheetNames) {
        try {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            results.errors.push(`Worksheet "${sheetName}" is empty`);
            continue;
          }

          // First row contains headers
          const headers = jsonData[0];
          const dataRows = jsonData.slice(1);

          // Create worksheet record
          const worksheetRecord = await this.db.createWorksheet({
            name: sheetName,
            description: `Imported from ${originalName}`,
            file_name: originalName,
            total_records: dataRows.length
          });

          const processedData = await this.processWorksheetData(
            worksheetRecord.id,
            headers,
            dataRows,
            sheetName
          );

          results.worksheets.push({
            name: sheetName,
            id: worksheetRecord.id,
            headers: headers,
            recordsProcessed: processedData.recordsProcessed,
            studentsCreated: processedData.studentsCreated,
            studentsUpdated: processedData.studentsUpdated,
            errors: processedData.errors
          });

          results.totalRecords += processedData.recordsProcessed;
          results.errors = results.errors.concat(processedData.errors);

        } catch (error) {
          console.error(`Error processing worksheet "${sheetName}":`, error);
          results.errors.push(`Error in worksheet "${sheetName}": ${error.message}`);
        }
      }

      // Save upload history
      await this.db.saveUploadHistory({
        file_name: path.basename(filePath),
        original_name: originalName,
        file_size: fs.statSync(filePath).size,
        records_processed: results.totalRecords,
        status: results.errors.length > 0 ? 'completed_with_errors' : 'completed'
      });

      // Clean up uploaded file
      this.cleanupFile(filePath);

      return results;

    } catch (error) {
      console.error('Error processing Excel file:', error);
      this.cleanupFile(filePath);
      throw new Error(`Failed to process Excel file: ${error.message}`);
    }
  }

  async processWorksheetData(worksheetId, headers, dataRows, sheetName) {
    const results = {
      recordsProcessed: 0,
      studentsCreated: 0,
      studentsUpdated: 0,
      errors: []
    };

    // Find student identifier columns
    const studentNumberIndex = this.findColumnIndex(headers, ['student number', 'student_number', 'id', 'student id']);
    const nameIndex = this.findColumnIndex(headers, ['name', 'student name', 'full name']);
    const sectionIndex = this.findColumnIndex(headers, ['section', 'class', 'group']);

    if (studentNumberIndex === -1) {
      throw new Error(`No student identifier column found in worksheet "${sheetName}". Expected columns: "Student Number", "Student_Number", "ID", or "Student ID"`);
    }

    if (nameIndex === -1) {
      throw new Error(`No name column found in worksheet "${sheetName}". Expected columns: "Name", "Student Name", or "Full Name"`);
    }

    // Process each data row
    for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
      try {
        const row = dataRows[rowIndex];
        
        // Skip empty rows
        if (!row || row.every(cell => !cell || cell.toString().trim() === '')) {
          continue;
        }

        const studentNumber = row[studentNumberIndex]?.toString().trim();
        const name = row[nameIndex]?.toString().trim();
        const section = sectionIndex !== -1 ? row[sectionIndex]?.toString().trim() : '';

        if (!studentNumber || !name) {
          results.errors.push(`Row ${rowIndex + 2}: Missing student number or name`);
          continue;
        }

        // Check if student exists
        let student = await this.db.getStudentByNumber(studentNumber);
        
        if (!student) {
          // Create new student
          student = await this.db.createStudent({
            student_number: studentNumber,
            name: name,
            section: section,
            email: '' // Can be added later
          });
          results.studentsCreated++;
        } else {
          // Update existing student if needed
          if (student.name !== name || student.section !== section) {
            await this.db.updateStudent(student.id, {
              name: name,
              section: section,
              email: student.email || ''
            });
            results.studentsUpdated++;
          }
        }

        // Save all column data for this student
        for (let colIndex = 0; colIndex < headers.length; colIndex++) {
          const header = headers[colIndex];
          const value = row[colIndex]?.toString().trim() || '';
          
          if (header && value) {
            await this.db.saveStudentData(
              student.id,
              worksheetId,
              header,
              value
            );
          }
        }

        results.recordsProcessed++;

      } catch (error) {
        console.error(`Error processing row ${rowIndex + 2}:`, error);
        results.errors.push(`Row ${rowIndex + 2}: ${error.message}`);
      }
    }

    return results;
  }

  findColumnIndex(headers, possibleNames) {
    for (const name of possibleNames) {
      const index = headers.findIndex(header => 
        header && header.toString().toLowerCase().trim() === name.toLowerCase()
      );
      if (index !== -1) return index;
    }
    return -1;
  }

  cleanupFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up file: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error cleaning up file ${filePath}:`, error);
    }
  }

  async getStudentDataForExport(studentNumber) {
    try {
      const student = await this.db.getStudentByNumber(studentNumber);
      if (!student) {
        return null;
      }

      const studentData = await this.db.getStudentData(student.id);
      const worksheets = await this.db.getWorksheets();

      // Group data by worksheet
      const groupedData = {};
      
      for (const data of studentData) {
        const worksheet = worksheets.find(w => w.id === data.worksheet_id);
        const worksheetName = worksheet ? worksheet.name : 'Unknown';
        
        if (!groupedData[worksheetName]) {
          groupedData[worksheetName] = {};
        }
        
        groupedData[worksheetName][data.data_key] = data.data_value;
      }

      return {
        student: student,
        data: groupedData
      };

    } catch (error) {
      console.error('Error getting student data for export:', error);
      throw error;
    }
  }
}

module.exports = ExcelProcessor;