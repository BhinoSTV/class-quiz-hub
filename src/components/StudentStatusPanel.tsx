
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Search, Eye, Download } from 'lucide-react';

interface StudentStatus {
  studentId: string;
  name: string;
  quiz1?: number;
  quiz2?: number;
  attendance?: string;
  remarks?: string;
  [key: string]: any; // Allow additional columns
}

interface StudentStatusPanelProps {
  isAdmin: boolean;
}

const StudentStatusPanel: React.FC<StudentStatusPanelProps> = ({ isAdmin }) => {
  const [studentData, setStudentData] = useState<StudentStatus[]>([]);
  const [previewData, setPreviewData] = useState<StudentStatus[]>([]);
  const [studentLookup, setStudentLookup] = useState('');
  const [foundStudent, setFoundStudent] = useState<StudentStatus | null>(null);
  const [uploadHistory, setUploadHistory] = useState<{ date: string; filename: string; recordCount: number }[]>([]);
  const { toast } = useToast();

  const parseCSV = (text: string): StudentStatus[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: StudentStatus[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length >= 2) {
        const student: StudentStatus = {
          studentId: values[0] || '',
          name: values[1] || '',
        };

        // Map remaining columns to student object
        for (let j = 2; j < headers.length && j < values.length; j++) {
          const header = headers[j].toLowerCase();
          const value = values[j];
          
          if (header.includes('quiz') && !isNaN(Number(value))) {
            student[header] = Number(value);
          } else {
            student[header] = value;
          }
        }

        data.push(student);
      }
    }
    return data;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = parseCSV(text);
        setPreviewData(parsed);
        toast({
          title: 'File Parsed Successfully',
          description: `Found ${parsed.length} student records. Review before publishing.`,
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
    setStudentData(previewData);
    setUploadHistory(prev => [...prev, {
      date: new Date().toLocaleDateString(),
      filename: `upload_${Date.now()}.csv`,
      recordCount: previewData.length
    }]);
    setPreviewData([]);
    toast({
      title: 'Data Published',
      description: `${previewData.length} student records are now live.`,
    });
  };

  const handleStudentLookup = () => {
    const student = studentData.find(s => 
      s.studentId.toLowerCase() === studentLookup.toLowerCase() || 
      s.name.toLowerCase().includes(studentLookup.toLowerCase())
    );
    
    if (student) {
      setFoundStudent(student);
      toast({
        title: 'Student Found',
        description: `Displaying status for ${student.name}`,
      });
    } else {
      setFoundStudent(null);
      toast({
        title: 'Student Not Found',
        description: 'Please check the Student ID or name and try again.',
        variant: 'destructive',
      });
    }
  };

  const getColumnHeaders = (data: StudentStatus[]) => {
    if (data.length === 0) return [];
    const allKeys = new Set<string>();
    data.forEach(student => {
      Object.keys(student).forEach(key => allKeys.add(key));
    });
    return Array.from(allKeys);
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
              <Label htmlFor="student-lookup">Enter your Student ID or Name</Label>
              <div className="flex gap-2">
                <Input
                  id="student-lookup"
                  value={studentLookup}
                  onChange={(e) => setStudentLookup(e.target.value)}
                  placeholder="e.g., 2023001 or Juan Dela Cruz"
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
                  <CardTitle className="text-lg">Your Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Student ID:</strong> {foundStudent.studentId}</p>
                      <p><strong>Name:</strong> {foundStudent.name}</p>
                    </div>
                    <div>
                      {Object.entries(foundStudent).map(([key, value]) => {
                        if (key !== 'studentId' && key !== 'name' && value !== undefined && value !== '') {
                          return (
                            <p key={key}>
                              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
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

            {studentData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No student status data has been uploaded yet.</p>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="current">Current Data</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="text-blue-600" />
                Upload Student Status Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Select CSV/Excel File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Expected CSV Format:</h4>
                <pre className="text-sm text-gray-600">
{`Student ID,Name,Quiz 1,Quiz 2,Attendance,Remarks
2023001,Juan Dela Cruz,9,10,Present,Doing well
2023002,Maria Santos,7,8,Absent,Needs improvement`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="text-blue-600" />
                Preview Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previewData.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {previewData.length} records ready to publish
                    </p>
                    <Button onClick={publishData} className="bg-green-600 hover:bg-green-700">
                      Publish Data
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {getColumnHeaders(previewData).map(header => (
                            <TableHead key={header} className="capitalize">
                              {header.replace(/([A-Z])/g, ' $1').trim()}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.slice(0, 10).map((student, index) => (
                          <TableRow key={index}>
                            {getColumnHeaders(previewData).map(header => (
                              <TableCell key={header}>
                                {student[header] || '-'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {previewData.length > 10 && (
                    <p className="text-sm text-gray-500 text-center">
                      Showing first 10 records. {previewData.length - 10} more will be included.
                    </p>
                  )}
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

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-blue-600" />
                Current Live Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studentData.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {studentData.length} student records currently live
                  </p>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {getColumnHeaders(studentData).map(header => (
                            <TableHead key={header} className="capitalize">
                              {header.replace(/([A-Z])/g, ' $1').trim()}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentData.map((student, index) => (
                          <TableRow key={index}>
                            {getColumnHeaders(studentData).map(header => (
                              <TableCell key={header}>
                                {student[header] || '-'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No student data published yet.</p>
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
                        <p className="text-sm text-gray-600">{upload.recordCount} records</p>
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
