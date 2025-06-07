import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoLecture from '@/components/VideoLecture';
import QuizComponent from '@/components/QuizComponent';
import AdminPanel from '@/components/AdminPanel';
import StudentDashboard from '@/components/StudentDashboard';
import StudentStatusPanel from '@/components/StudentStatusPanel';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Users, Award, Settings, FileText } from 'lucide-react';

interface Lecture {
  id: string;
  title: string;
  videoId: string;
  week: number;
  description: string;
}

interface Quiz {
  id: string;
  lectureId: string;
  title: string;
  questions: Question[];
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
}

interface StudentScore {
  studentId: string;
  studentName: string;
  quizId: string;
  score: number;
  totalPoints: number;
  completedAt: string;
}

const Index = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [studentScores, setStudentScores] = useState<StudentScore[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('lectures');
  const { toast } = useToast();

  // Initialize sample data
  useEffect(() => {
    const sampleLectures: Lecture[] = [
      {
        id: '1',
        title: 'Introduction to Web Development',
        videoId: 'dQw4w9WgXcQ', // Sample YouTube video ID
        week: 1,
        description: 'Learn the basics of HTML, CSS, and JavaScript'
      },
      {
        id: '2',
        title: 'React Fundamentals',
        videoId: 'dQw4w9WgXcQ',
        week: 2,
        description: 'Understanding components, props, and state'
      }
    ];

    const sampleQuizzes: Quiz[] = [
      {
        id: '1',
        lectureId: '1',
        title: 'Web Development Basics Quiz',
        questions: [
          {
            id: '1',
            type: 'multiple-choice',
            question: 'What does HTML stand for?',
            options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
            correctAnswer: 'Hyper Text Markup Language',
            points: 10
          },
          {
            id: '2',
            type: 'true-false',
            question: 'CSS is used for styling web pages.',
            correctAnswer: 'true',
            points: 5
          }
        ]
      }
    ];

    setLectures(sampleLectures);
    setQuizzes(sampleQuizzes);
  }, []);

  const handleLectureSelect = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setSelectedQuiz(null);
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setSelectedLecture(null);
  };

  const handleQuizComplete = (score: number, totalPoints: number, studentName: string) => {
    if (!selectedQuiz) return;

    const newScore: StudentScore = {
      studentId: Date.now().toString(),
      studentName,
      quizId: selectedQuiz.id,
      score,
      totalPoints,
      completedAt: new Date().toISOString()
    };

    setStudentScores(prev => [...prev, newScore]);
    toast({
      title: 'Quiz Completed!',
      description: `Score: ${score}/${totalPoints} points`,
    });
  };

  const lecturesByWeek = lectures.reduce((acc, lecture) => {
    if (!acc[lecture.week]) {
      acc[lecture.week] = [];
    }
    acc[lecture.week].push(lecture);
    return acc;
  }, {} as Record<number, Lecture[]>);

  if (selectedLecture) {
    return <VideoLecture lecture={selectedLecture} onBack={() => setSelectedLecture(null)} />;
  }

  if (selectedQuiz) {
    return (
      <QuizComponent
        quiz={selectedQuiz}
        onComplete={handleQuizComplete}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <BookOpen className="text-blue-600" />
            Classroom Learning Hub
          </h1>
          <p className="text-xl text-gray-600">Interactive lectures and assessments</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="lectures" className="flex items-center gap-2">
              <BookOpen size={16} />
              Lectures
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <Award size={16} />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users size={16} />
              Students
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <FileText size={16} />
              Status
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings size={16} />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lectures">
            <div className="space-y-8">
              {Object.entries(lecturesByWeek).map(([week, weekLectures]) => (
                <Card key={week} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-blue-700">Week {week}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {weekLectures.map((lecture) => (
                        <Card key={lecture.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4" onClick={() => handleLectureSelect(lecture)}>
                            <h3 className="font-semibold mb-2">{lecture.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{lecture.description}</p>
                            <Button variant="outline" className="w-full">
                              Watch Lecture
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quizzes">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => {
                const lecture = lectures.find(l => l.id === quiz.lectureId);
                return (
                  <Card key={quiz.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6" onClick={() => handleQuizSelect(quiz)}>
                      <h3 className="font-semibold mb-2">{quiz.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Related to: {lecture?.title}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        {quiz.questions.length} questions
                      </p>
                      <Button variant="default" className="w-full">
                        Take Quiz
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="students">
            <StudentDashboard scores={studentScores} lectures={lectures} quizzes={quizzes} />
          </TabsContent>

          <TabsContent value="status">
            <StudentStatusPanel isAdmin={isAdmin} />
          </TabsContent>

          <TabsContent value="admin">
            <AdminPanel
              isAdmin={isAdmin}
              onAdminLogin={setIsAdmin}
              lectures={lectures}
              quizzes={quizzes}
              onLecturesUpdate={setLectures}
              onQuizzesUpdate={setQuizzes}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
