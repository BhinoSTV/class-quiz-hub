
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Lectures
          </Button>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-blue-700 flex items-center gap-3">
              <Play className="text-blue-600" />
              {lecture.title}
            </CardTitle>
            <p className="text-gray-600 text-lg">Week {lecture.week}</p>
          </CardHeader>
          <CardContent>
            <div className="aspect-video mb-6 rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${lecture.videoId}`}
                title={lecture.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-800">About this lecture</h3>
              <p className="text-gray-700 leading-relaxed">{lecture.description}</p>
            </div>

            <div className="mt-6 flex justify-center">
              <Button onClick={onBack} size="lg" className="px-8">
                Continue to Next Lecture
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoLecture;
