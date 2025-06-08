
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mail, Globe, Award, BookOpen, Users } from 'lucide-react';

const InstructorProfile: React.FC = () => {
  return (
    <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden animate-fade-in">
      <div className="h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
      
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <Avatar className="w-32 h-32 mx-auto ring-4 ring-emerald-500/20 shadow-2xl">
              <AvatarImage src="/placeholder.svg" alt="Instructor" />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                DR
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <Award className="text-white" size={24} />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-2">
            Dr. Sarah Mitchell
          </h2>
          <p className="text-xl text-gray-600 font-medium mb-4">
            Senior Lecturer in Computer Science
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">
              PhD Computer Science
            </Badge>
            <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors">
              Web Development Expert
            </Badge>
            <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors">
              10+ Years Teaching
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="text-emerald-600" size={24} />
                About Me
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Passionate educator with over a decade of experience in computer science education. 
                I specialize in making complex programming concepts accessible and engaging for students 
                at all levels. My research focuses on innovative teaching methodologies in software development.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="text-emerald-600" size={24} />
                Teaching Philosophy
              </h3>
              <p className="text-gray-600 leading-relaxed">
                I believe in hands-on learning and real-world applications. Every lesson is designed 
                to build practical skills that students can immediately apply in their projects and future careers.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors">
                  <Mail size={18} />
                  <span>sarah.mitchell@university.edu</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors">
                  <MapPin size={18} />
                  <span>Computer Science Building, Room 301</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors">
                  <Globe size={18} />
                  <span>www.university.edu/faculty/sarah-mitchell</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Office Hours</h3>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100">
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday & Wednesday:</span>
                    <span>2:00 PM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Friday:</span>
                    <span>10:00 AM - 12:00 PM</span>
                  </div>
                  <div className="text-sm text-emerald-600 font-medium mt-2">
                    Or by appointment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-emerald-700">150+</div>
              <div className="text-sm text-emerald-600">Students Taught</div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-teal-700">25+</div>
              <div className="text-sm text-teal-600">Courses Designed</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-cyan-700">4.9/5</div>
              <div className="text-sm text-cyan-600">Student Rating</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorProfile;
