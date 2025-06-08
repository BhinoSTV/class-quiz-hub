
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Search, Eye, Download, Edit, Save, Plus, Trash2 } from 'lucide-react';

interface Student {
  studentNumber: string;
  name: string;
  section: string;
  [key: string]: any;
}

interface WorksheetData {
  name: string;
  headers: string[];
  data: Record<string, any>[];
}

interface StudentStatusPanelProps {
  isAdmin: boolean;
}

const StudentStatusPanel: React.FC<StudentStatusPanelProps> = ({ isAdmin }) => {
  const [worksheets, setWorksheets] = useState<WorksheetData[]>([]);
  const [previewWorksheets, setPreviewWorksheets] = useState<WorksheetData[]>([]);
  const [studentLookup, setStudentLookup] = useState('');
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [uploadHistory, setUploadHistory] = useState<{ date: string; filename: string; worksheetCount: number }[]>([]);
  const [editMode, setEditMode] = useState<{ worksheet: string; row: number } | null>(null);
  const [editingData, setEditingData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const parseExcelFile = (text: string): WorksheetData[] => {
    // Simulate parsing multiple worksheets from Excel
    // In a real implementation, this would use a library like xlsx
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    // For demo purposes, we'll simulate multiple worksheets
    const masterSheet: WorksheetData = {
      name: 'Students',
      headers: ['Student Number', 'Name', 'Section'],
      data: []
    };

    const examSheet: WorksheetData = {
      name: 'Exams',
      headers: ['Student Number', 'Midterm', 'Final'],
      data: []
    };

    const quizSheet: WorksheetData = {
      name: 'Quizzes',
      headers: ['Student Number', 'Quiz 1', 'Quiz 2', 'Quiz 3'],
      data: []
    };

    const projectSheet: WorksheetData = {
      name: 'Projects',
      headers: ['Student Number', 'Project 1', 'Project 2'],
      data: []
    };

    // Parse the uploaded CSV as master student list
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length >= 2) {
        const studentNumber = values[0] || `STU${i.toString().padStart(3, '0')}`;
        const name = values[1] || `Student ${i}`;
        const section = values[2] || 'A';

        // Add to master sheet
        const masterRecord: Record<string, any> = { 'Student Number': studentNumber, 'Name': name, 'Section': section };
        masterSheet.data.push(masterRecord);

        // Add placeholder data to other sheets
        examSheet.data.push({ 'Student Number': studentNumber, 'Midterm': '', 'Final': '' });
        quizSheet.data.push({ 'Student Number': studentNumber, 'Quiz 1': '', 'Quiz 2': '', 'Quiz 3': '' });
        projectSheet.data.push({ 'Student Number': studentNumber, 'Project 1': '', 'Project 2': '' });
      }
    }

    return [masterSheet, examSheet, quizSheet, projectSheet];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = parseExcelFile(text);
        setPreviewWorksheets(parsed);
        toast({
          title: 'File Parsed Successfully',
          description: `Found ${parsed.length} worksheets with student data. Review before publishing.`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to parse file. Please check the format.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const publishData = () => {
    setWorksheets(previewWorksheets);
    setUploadHistory(prev => [...prev, {
      date: new Date().toLocaleDateString(),
      filename: `workbook_${Date.now()}.xlsx`,
      worksheetCount: previewWorksheets.length
    }]);
    setPreviewWorksheets([]);
    toast({
      title: 'Data Published',
      description: `${previewWorksheets.length} worksheets are now live.`,
    });
  };

  const handleStudentLookup = () => {
    if (worksheets.length === 0) {
      toast({
        title: 'No Data Available',
        description: 'Please upload student data first.',
        variant: 'destructive',
      });
      return;
    }

    const masterSheet = worksheets.find(w => w.name === 'Students');
    if (!masterSheet) return;

    const student = masterSheet.data.find(s => 
      s['Student Number']?.toLowerCase() === studentLookup.toLowerCase() || 
      s['Name']?.toLowerCase().includes(studentLookup.toLowerCase())
    );
    
    if (student) {
      // Compile data from all worksheets for this student
      const compiledData: Student = { ...student };
      worksheets.forEach(worksheet => {
        if (worksheet.name !== 'Students') {
          const studentRecord = worksheet.data.find(d => d['Student Number'] === student['Student Number']);
          if (studentRecord) {
            Object.assign(compiledData, studentRecord);
          }
        }
      });
      
      setFoundStudent(compiledData);
      toast({
        title: 'Student Found',
        description: `Displaying status for ${student['Name']}`,
      });
    } else {
      setFoundStudent(null);
      toast({
        title: 'Student Not Found',
        description: 'Please check the Student Number or name and try again.',
        variant: 'destructive',
      });
    }
  };

  const startEdit = (worksheetName: string, rowIndex: number, data: Record<string, any>) => {
    setEditMode({ worksheet: worksheetName, row: rowIndex });
    setEditingData({ ...data });
  };

  const saveEdit = () => {
    if (!editMode) return;

    setWorksheets(prev => prev.map(worksheet => {
      if (worksheet.name === editMode.worksheet) {
        const newData = [...worksheet.data];
        newData[editMode.row] = { ...editingData };
        return { ...worksheet, data: newData };
      }
      return worksheet;
    }));

    setEditMode(null);
    setEditingData({});
    toast({
      title: 'Changes Saved',
      description: 'Student record updated successfully.',
    });
  };

  const addNewStudent = (worksheetName: string) => {
    const newStudentNumber = `STU${Date.now().toString().slice(-3)}`;
    
    setWorksheets(prev => prev.map(worksheet => {
      if (worksheet.name === worksheetName) {
        const newRecord: Record<string, any> = {};
        worksheet.headers.forEach(header => {
          newRecord[header] = header === 'Student Number' ? newStudentNumber : '';
        });
        return { ...worksheet, data: [...worksheet.data, newRecord] };
      }
      return worksheet;
    }));

    toast({
      title: 'Student Added',
      description: `New student ${newStudentNumber} added to ${worksheetName}.`,
    });
  };

  const deleteStudent = (worksheetName: string, rowIndex: number) => {
    setWorksheets(prev => prev.map(worksheet => {
      if (worksheet.name === worksheetName) {
        const newData = worksheet.data.filter((_, index) => index !== rowIndex);
        return { ...worksheet, data: newData };
      }
      return worksheet;
    }));

    toast({
      title: 'Student Removed',
      description: 'Student record deleted successfully.',
    });
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="text-blue-600" />
              Check Your Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="student-lookup">Enter your Student Number or Name</Label>
              <div className="flex gap-2">
                <Input
                  id="student-lookup"
                  value={studentLookup}
                  onChange={(e) => setStudentLookup(e.target.value)}
                  placeholder="e.g., STU001 or Juan Dela Cruz"
                  onKeyPress={(e) => e.key === 'Enter' && handleStudentLookup()}
                />
                <Button onClick={handleStudentLookup}>
                  <Search size={16} />
                  Search
                </Button>
              </div>
            </div>

            {foundStudent && (
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">Your Academic Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Student Number:</strong> {foundStudent['Student Number']}</p>
                      <p><strong>Name:</strong> {foundStudent['Name']}</p>
                      <p><strong>Section:</strong> {foundStudent['Section']}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Academic Performance:</h4>
                      {Object.entries(foundStudent).map(([key, value]) => {
                        if (!['Student Number', 'Name', 'Section'].includes(key) && value !== undefined && value !== '') {
                          return (
                            <p key={key}>
                              <strong>{key}:</strong> {value}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {worksheets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No student data has been uploaded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload">Upload Excel</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="edit">Edit Data</TabsTrigger>
          <TabsTrigger value="current">Current Data</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="text-blue-600" />
                Upload Excel Workbook
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Select Excel File (.xlsx)</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Expected Excel Structure:</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Worksheet 1 (Students):</strong> Student Number, Name, Section</p>
                  <p><strong>Worksheet 2 (Exams):</strong> Student Number, Midterm, Final</p>
                  <p><strong>Worksheet 3 (Quizzes):</strong> Student Number, Quiz 1, Quiz 2, Quiz 3</p>
                  <p><strong>Worksheet 4 (Projects):</strong> Student Number, Project 1, Project 2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="text-blue-600" />
                Preview Worksheets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previewWorksheets.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {previewWorksheets.length} worksheets ready to publish
                    </p>
                    <Button onClick={publishData} className="bg-green-600 hover:bg-green-700">
                      Publish All Data
                    </Button>
                  </div>
                  
                  <Tabs defaultValue={previewWorksheets[0]?.name} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      {previewWorksheets.map(worksheet => (
                        <TabsTrigger key={worksheet.name} value={worksheet.name}>
                          {worksheet.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {previewWorksheets.map(worksheet => (
                      <TabsContent key={worksheet.name} value={worksheet.name}>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {worksheet.headers.map(header => (
                                  <TableHead key={header}>{header}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {worksheet.data.slice(0, 5).map((row, index) => (
                                <TableRow key={index}>
                                  {worksheet.headers.map(header => (
                                    <TableCell key={header}>
                                      {row[header] || '-'}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        {worksheet.data.length > 5 && (
                          <p className="text-sm text-gray-500 text-center mt-2">
                            Showing first 5 records. {worksheet.data.length - 5} more will be included.
                          </p>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No data to preview. Please upload a file first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="text-blue-600" />
                Edit Student Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              {worksheets.length > 0 ? (
                <Tabs defaultValue={worksheets[0]?.name} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    {worksheets.map(worksheet => (
                      <TabsTrigger key={worksheet.name} value={worksheet.name}>
                        {worksheet.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {worksheets.map(worksheet => (
                    <TabsContent key={worksheet.name} value={worksheet.name}>
                      <div className="space-y-4">
                        <div className="flex justify-end">
                          <Button onClick={() => addNewStudent(worksheet.name)} className="flex items-center gap-2">
                            <Plus size={16} />
                            Add Student
                          </Button>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {worksheet.headers.map(header => (
                                  <TableHead key={header}>{header}</TableHead>
                                ))}
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {worksheet.data.map((row, index) => (
                                <TableRow key={index}>
                                  {worksheet.headers.map(header => (
                                    <TableCell key={header}>
                                      {editMode?.worksheet === worksheet.name && editMode?.row === index ? (
                                        <Input
                                          value={editingData[header] || ''}
                                          onChange={(e) => setEditingData(prev => ({
                                            ...prev,
                                            [header]: e.target.value
                                          }))}
                                        />
                                      ) : (
                                        row[header] || '-'
                                      )}
                                    </TableCell>
                                  ))}
                                  <TableCell>
                                    {editMode?.worksheet === worksheet.name && editMode?.row === index ? (
                                      <div className="flex gap-2">
                                        <Button size="sm" onClick={saveEdit}>
                                          <Save size={14} />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => setEditMode(null)}>
                                          Cancel
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="flex gap-2">
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => startEdit(worksheet.name, index, row)}
                                        >
                                          <Edit size={14} />
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => deleteStudent(worksheet.name, index)}
                                        >
                                          <Trash2 size={14} />
                                        </Button>
                                      </div>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Edit size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No data to edit. Please upload and publish data first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-blue-600" />
                Current Live Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              {worksheets.length > 0 ? (
                <Tabs defaultValue={worksheets[0]?.name} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    {worksheets.map(worksheet => (
                      <TabsTrigger key={worksheet.name} value={worksheet.name}>
                        {worksheet.name} ({worksheet.data.length})
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {worksheets.map(worksheet => (
                    <TabsContent key={worksheet.name} value={worksheet.name}>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {worksheet.headers.map(header => (
                                <TableHead key={header}>{header}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {worksheet.data.map((row, index) => (
                              <TableRow key={index}>
                                {worksheet.headers.map(header => (
                                  <TableCell key={header}>
                                    {row[header] || '-'}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No data published yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="text-blue-600" />
                Upload History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadHistory.length > 0 ? (
                <div className="space-y-2">
                  {uploadHistory.map((upload, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">{upload.filename}</p>
                        <p className="text-sm text-gray-600">{upload.worksheetCount} worksheets</p>
                      </div>
                      <p className="text-sm text-gray-500">{upload.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Download size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No upload history available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentStatusPanel;
