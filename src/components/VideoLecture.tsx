
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Clock, BookOpen } from 'lucide-react';

interface Lecture {
  id: string;
  title: string;
  videoId: string;
  week: number;
  description: string;
}

interface VideoLectureProps {
  lecture: Lecture;
  onBack: () => void;
}

const VideoLecture: React.FC<VideoLectureProps> = ({ lecture, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl p-6 relative z-10">
        <div className="mb-8 animate-fade-in">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-3"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Lectures</span>
          </Button>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden animate-scale-in">
          <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
          
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <Play className="text-white" size={32} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
                  {lecture.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} />
                    <span className="font-medium">Week {lecture.week}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>Interactive Learning</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="mb-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${lecture.videoId}`}
                    title={lecture.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                  ></iframe>
                </div>
                <div className="absolute inset-0 ring-4 ring-blue-500/20 rounded-2xl pointer-events-none group-hover:ring-blue-500/40 transition-all duration-300"></div>
              </div>
            </div>
            
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <BookOpen className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-800 mb-4">About this lecture</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{lecture.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 flex justify-center">
              <Button 
                onClick={onBack} 
                size="lg" 
                className="px-12 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                Continue Learning Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoLecture;
