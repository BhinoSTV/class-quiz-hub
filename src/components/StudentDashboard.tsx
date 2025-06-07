
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, TrendingUp, Calendar } from 'lucide-react';

interface StudentScore {
  studentId: string;
  studentName: string;
  quizId: string;
  score: number;
  totalPoints: number;
  completedAt: string;
}

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
  questions: any[];
}

interface StudentDashboardProps {
  scores: StudentScore[];
  lectures: Lecture[];
  quizzes: Quiz[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ scores, lectures, quizzes }) => {
  const getQuizTitle = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz?.title || 'Unknown Quiz';
  };

  const getAverageScore = (studentName: string) => {
    const studentScores = scores.filter(s => s.studentName === studentName);
    if (studentScores.length === 0) return 0;
    
    const total = studentScores.reduce((sum, score) => {
      return sum + (score.score / score.totalPoints) * 100;
    }, 0);
    
    return Math.round(total / studentScores.length);
  };

  const uniqueStudents = [...new Set(scores.map(s => s.studentName))];
  const totalQuizzes = quizzes.length;
  const totalAttempts = scores.length;
  const averageClassScore = scores.length > 0 
    ? Math.round(scores.reduce((sum, score) => sum + (score.score / score.totalPoints) * 100, 0) / scores.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{uniqueStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Quiz Attempts</p>
                <p className="text-2xl font-bold">{totalAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-purple-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Class Average</p>
                <p className="text-2xl font-bold">{averageClassScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="text-orange-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Available Quizzes</p>
                <p className="text-2xl font-bold">{totalQuizzes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uniqueStudents.map((studentName) => {
                const studentScores = scores.filter(s => s.studentName === studentName);
                const avgScore = getAverageScore(studentName);
                
                return (
                  <div key={studentName} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{studentName}</p>
                      <p className="text-sm text-gray-600">
                        {studentScores.length} quiz{studentScores.length !== 1 ? 'es' : ''} completed
                      </p>
                    </div>
                    <Badge 
                      variant={avgScore >= 80 ? 'default' : avgScore >= 60 ? 'secondary' : 'destructive'}
                    >
                      {avgScore}%
                    </Badge>
                  </div>
                );
              })}
              {uniqueStudents.length === 0 && (
                <p className="text-gray-500 text-center py-8">No student data available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scores
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .slice(0, 10)
                .map((score, index) => {
                  const percentage = Math.round((score.score / score.totalPoints) * 100);
                  const date = new Date(score.completedAt).toLocaleDateString();
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{score.studentName}</p>
                        <p className="text-sm text-gray-600">{getQuizTitle(score.quizId)}</p>
                        <p className="text-xs text-gray-500">{date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{score.score}/{score.totalPoints}</p>
                        <Badge 
                          variant={percentage >= 80 ? 'default' : percentage >= 60 ? 'secondary' : 'destructive'}
                        >
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              {scores.length === 0 && (
                <p className="text-gray-500 text-center py-8">No quiz results available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
