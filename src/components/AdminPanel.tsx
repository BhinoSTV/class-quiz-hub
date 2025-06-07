
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Lock, Plus, Trash2, Edit } from 'lucide-react';

interface Lecture {
  id: string;
  title: string;
  videoId: string;
  week: number;
  description: string;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
}

interface Quiz {
  id: string;
  lectureId: string;
  title: string;
  questions: Question[];
}

interface AdminPanelProps {
  isAdmin: boolean;
  onAdminLogin: (status: boolean) => void;
  lectures: Lecture[];
  quizzes: Quiz[];
  onLecturesUpdate: (lectures: Lecture[]) => void;
  onQuizzesUpdate: (quizzes: Quiz[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  isAdmin,
  onAdminLogin,
  lectures,
  quizzes,
  onLecturesUpdate,
  onQuizzesUpdate
}) => {
  const [password, setPassword] = useState('');
  const [newLecture, setNewLecture] = useState<Omit<Lecture, 'id'>>({
    title: '',
    videoId: '',
    week: 1,
    description: ''
  });
  const [newQuiz, setNewQuiz] = useState<Omit<Quiz, 'id'>>({
    lectureId: '',
    title: '',
    questions: []
  });
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const { toast } = useToast();

  const ADMIN_PASSWORD = 'admin123'; // In a real app, this would be more secure

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      onAdminLogin(true);
      toast({
        title: 'Login Successful',
        description: 'Welcome to the admin panel!',
      });
    } else {
      toast({
        title: 'Login Failed',
        description: 'Incorrect password',
        variant: 'destructive',
      });
    }
    setPassword('');
  };

  const handleAddLecture = () => {
    if (!newLecture.title || !newLecture.videoId) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const lecture: Lecture = {
      ...newLecture,
      id: Date.now().toString()
    };

    onLecturesUpdate([...lectures, lecture]);
    setNewLecture({ title: '', videoId: '', week: 1, description: '' });
    toast({
      title: 'Success',
      description: 'Lecture added successfully!',
    });
  };

  const handleDeleteLecture = (lectureId: string) => {
    onLecturesUpdate(lectures.filter(l => l.id !== lectureId));
    // Also delete associated quizzes
    onQuizzesUpdate(quizzes.filter(q => q.lectureId !== lectureId));
    toast({
      title: 'Deleted',
      description: 'Lecture and associated quizzes deleted',
    });
  };

  const handleUpdateLecture = () => {
    if (!editingLecture) return;

    onLecturesUpdate(lectures.map(l => l.id === editingLecture.id ? editingLecture : l));
    setEditingLecture(null);
    toast({
      title: 'Updated',
      description: 'Lecture updated successfully!',
    });
  };

  const extractVideoId = (url: string): string => {
    // Extract YouTube video ID from various URL formats
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Lock className="text-blue-600" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <div className="text-xs text-gray-500 text-center">
              Demo password: admin123
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-700">Admin Panel</h2>
        <Button variant="outline" onClick={() => onAdminLogin(false)}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="lectures" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lectures">Manage Lectures</TabsTrigger>
          <TabsTrigger value="quizzes">Manage Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="lectures" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus size={20} />
                Add New Lecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Lecture Title</Label>
                  <Input
                    id="title"
                    value={newLecture.title}
                    onChange={(e) => setNewLecture(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Introduction to React"
                  />
                </div>
                <div>
                  <Label htmlFor="week">Week</Label>
                  <Input
                    id="week"
                    type="number"
                    value={newLecture.week}
                    onChange={(e) => setNewLecture(prev => ({ ...prev, week: parseInt(e.target.value) }))}
                    min="1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="videoId">YouTube Video URL or ID</Label>
                <Input
                  id="videoId"
                  value={newLecture.videoId}
                  onChange={(e) => setNewLecture(prev => ({ ...prev, videoId: extractVideoId(e.target.value) }))}
                  placeholder="https://youtube.com/watch?v=... or video ID"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newLecture.description}
                  onChange={(e) => setNewLecture(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the lecture content"
                />
              </div>
              <Button onClick={handleAddLecture}>Add Lecture</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Lectures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lectures.map((lecture) => (
                  <div key={lecture.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h3 className="font-semibold">{lecture.title}</h3>
                      <p className="text-sm text-gray-600">Week {lecture.week}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingLecture(lecture)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteLecture(lecture.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {editingLecture && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Lecture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-title">Lecture Title</Label>
                    <Input
                      id="edit-title"
                      value={editingLecture.title}
                      onChange={(e) => setEditingLecture(prev => prev ? { ...prev, title: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-week">Week</Label>
                    <Input
                      id="edit-week"
                      type="number"
                      value={editingLecture.week}
                      onChange={(e) => setEditingLecture(prev => prev ? { ...prev, week: parseInt(e.target.value) } : null)}
                      min="1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-videoId">YouTube Video ID</Label>
                  <Input
                    id="edit-videoId"
                    value={editingLecture.videoId}
                    onChange={(e) => setEditingLecture(prev => prev ? { ...prev, videoId: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingLecture.description}
                    onChange={(e) => setEditingLecture(prev => prev ? { ...prev, description: e.target.value } : null)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateLecture}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditingLecture(null)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Quiz management functionality will be expanded in future updates. 
                For now, quizzes are managed through the sample data.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
