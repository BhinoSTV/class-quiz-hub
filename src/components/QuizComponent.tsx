
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CheckCircle, Award } from 'lucide-react';

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

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number, totalPoints: number, studentName: string) => void;
  onBack: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [studentName, setStudentName] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showNameInput, setShowNameInput] = useState(true);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id]?.toLowerCase().trim();
      const correctAnswer = question.correctAnswer.toLowerCase().trim();
      
      if (userAnswer === correctAnswer) {
        totalScore += question.points;
      }
    });
    
    setScore(totalScore);
    setShowResults(true);
  };

  const handleFinish = () => {
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    onComplete(score, totalPoints, studentName);
  };

  const currentQ = quiz.questions[currentQuestion];
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-blue-700">
              {quiz.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="studentName">Enter your name to begin:</Label>
              <Input
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Your full name"
                className="mt-2"
              />
            </div>
            <div className="text-center text-sm text-gray-600">
              {quiz.questions.length} questions • {totalPoints} total points
            </div>
            <Button
              onClick={() => setShowNameInput(false)}
              disabled={!studentName.trim()}
              className="w-full"
              size="lg"
            >
              Start Quiz
            </Button>
            <Button variant="outline" onClick={onBack} className="w-full">
              <ArrowLeft size={16} className="mr-2" />
              Back to Quizzes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / totalPoints) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Award className="text-green-600" size={32} />
            </div>
            <CardTitle className="text-2xl text-green-700">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <div className="text-4xl font-bold text-blue-700">{score}/{totalPoints}</div>
              <div className="text-lg text-gray-600">{percentage}%</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">
                Great job, {studentName}! Your score has been recorded.
              </p>
            </div>
            <Button onClick={handleFinish} className="w-full" size="lg">
              <CheckCircle size={16} className="mr-2" />
              Finish
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQ.question}
            </CardTitle>
            <p className="text-sm text-gray-600">{currentQ.points} points</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQ.type === 'multiple-choice' && (
              <RadioGroup
                value={answers[currentQ.id] || ''}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
              >
                {currentQ.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQ.type === 'true-false' && (
              <RadioGroup
                value={answers[currentQ.id] || ''}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="true" />
                  <Label htmlFor="true" className="cursor-pointer">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="false" />
                  <Label htmlFor="false" className="cursor-pointer">False</Label>
                </div>
              </RadioGroup>
            )}

            {currentQ.type === 'short-answer' && (
              <div>
                <Label htmlFor="answer">Your answer:</Label>
                <Input
                  id="answer"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="mt-2"
                />
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
              >
                {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizComponent;
