
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VideoLecture from '@/components/VideoLecture';
import QuizComponent from '@/components/QuizComponent';
import AdminPanel from '@/components/AdminPanel';
import StudentDashboard from '@/components/StudentDashboard';
import StudentStatusPanel from '@/components/StudentStatusPanel';
import InstructorProfile from '@/components/InstructorProfile';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Users, Award, Settings, FileText, GraduationCap, Sparkles } from 'lucide-react';

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

  const renderContent = () => {
    switch (activeTab) {
      case 'instructor':
        return <InstructorProfile />;

      case 'admin':
        return (
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-slate-700 bg-clip-text text-transparent flex items-center gap-3">
                <Settings className="text-gray-600" size={28} />
                Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <AdminPanel
                isAdmin={isAdmin}
                onAdminLogin={setIsAdmin}
                lectures={lectures}
                quizzes={quizzes}
                onLecturesUpdate={setLectures}
                onQuizzesUpdate={setQuizzes}
              />
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Main Navigation Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 border-0 bg-gradient-to-br from-white to-blue-50/70 overflow-hidden"
                    onClick={() => setActiveTab('lectures')}>
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">Lectures</h3>
                  <p className="text-gray-600 text-sm">Watch course videos and learn</p>
                </CardContent>
              </Card>

              <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 border-0 bg-gradient-to-br from-white to-purple-50/70 overflow-hidden"
                    onClick={() => setActiveTab('quizzes')}>
                <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Award className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">Quizzes</h3>
                  <p className="text-gray-600 text-sm">Test your knowledge</p>
                </CardContent>
              </Card>

              <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 border-0 bg-gradient-to-br from-white to-indigo-50/70 overflow-hidden"
                    onClick={() => setActiveTab('students')}>
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500"></div>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-700 transition-colors">Students</h3>
                  <p className="text-gray-600 text-sm">View student dashboard</p>
                </CardContent>
              </Card>

              <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 border-0 bg-gradient-to-br from-white to-green-50/70 overflow-hidden"
                    onClick={() => setActiveTab('status')}>
                <div className="h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">Status</h3>
                  <p className="text-gray-600 text-sm">Check student progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Content based on selected tab */}
            {activeTab === 'lectures' && (
              <div className="space-y-8">
                {Object.entries(lecturesByWeek).map(([week, weekLectures]) => (
                  <Card key={week} className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {week}
                        </div>
                        Week {week}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {weekLectures.map((lecture) => (
                          <Card key={lecture.id} className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 bg-gradient-to-br from-white to-blue-50/50 overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300"></div>
                            <CardContent className="p-6" onClick={() => handleLectureSelect(lecture)}>
                              <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                  <BookOpen className="text-white" size={20} />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">{lecture.title}</h3>
                                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{lecture.description}</p>
                                </div>
                              </div>
                              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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
            )}

            {activeTab === 'quizzes' && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => {
                  const lecture = lectures.find(l => l.id === quiz.lectureId);
                  return (
                    <Card key={quiz.id} className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 bg-gradient-to-br from-white to-purple-50/50 overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300"></div>
                      <CardContent className="p-8" onClick={() => handleQuizSelect(quiz)}>
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Award className="text-white" size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-purple-700 transition-colors duration-300">{quiz.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Related to: <span className="font-medium text-purple-600">{lecture?.title}</span>
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                              {quiz.questions.length} questions
                            </p>
                          </div>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                          Take Quiz
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {activeTab === 'students' && (
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-blue-700 bg-clip-text text-transparent flex items-center gap-3">
                    <Users className="text-indigo-600" size={28} />
                    Student Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <StudentDashboard scores={studentScores} lectures={lectures} quizzes={quizzes} />
                </CardContent>
              </Card>
            )}

            {activeTab === 'status' && (
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent flex items-center gap-3">
                    <FileText className="text-green-600" size={28} />
                    Student Status Panel
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <StudentStatusPanel isAdmin={isAdmin} />
                </CardContent>
              </Card>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Menu */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="container mx-auto px-4 py-8 relative z-10 pl-20">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <GraduationCap className="text-6xl text-blue-600 drop-shadow-lg" size={64} />
              <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={24} />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 tracking-tight">
            Classroom Learning Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Interactive lectures and assessments designed to enhance your learning experience
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
        </header>

        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
