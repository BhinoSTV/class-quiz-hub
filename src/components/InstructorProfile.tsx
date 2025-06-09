
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Globe, Award, BookOpen, Users, Download, ExternalLink } from 'lucide-react';

const InstructorProfile: React.FC = () => {
  return (
    <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden animate-fade-in">
      <div className="h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
      
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <Avatar className="w-32 h-32 mx-auto ring-4 ring-emerald-500/20 shadow-2xl">
              <AvatarImage src="/lovable-uploads/976f0d67-a564-4b08-856a-588746411830.png" alt="Julius I. Jimenez" />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                JJ
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <Award className="text-white" size={24} />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-2">
            Julius I. Jimenez
          </h2>
          <p className="text-xl text-gray-600 font-medium mb-2">
            Professional Agricultural and Biosystems Engineer
          </p>
          <p className="text-lg text-gray-500 mb-4">
            PhD Scholar/Candidate • Faculty Researcher • Center Head
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">
              PhD Remote Sensing & GIS
            </Badge>
            <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors">
              Water Resources Expert
            </Badge>
            <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors">
              Licensed Engineer #8633
            </Badge>
          </div>

          <p className="text-gray-600 italic mb-6">
            "Explore my academic and professional journey."
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
              <Download size={16} />
              Download CV
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Get in Touch</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 hover:bg-emerald-50"
                onClick={() => window.open('https://www.researchgate.net/profile/Julius-Jimenez?ev=hdr_xprf', '_blank')}
              >
                <ExternalLink size={16} />
                ResearchGate
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 hover:bg-blue-50"
                onClick={() => window.open('https://scholar.google.co.uk/citations?user=AE2wetMAAAAJ&hl=en&oi=ao', '_blank')}
              >
                <ExternalLink size={16} />
                Google Scholar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 hover:bg-green-50"
                onClick={() => window.open('https://orcid.org/0009-0001-4036-8024', '_blank')}
              >
                <ExternalLink size={16} />
                ORCID
              </Button>
            </div>
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
                Professional Agricultural and Biosystems Engineer with expertise in Remote Sensing, GIS, and Water Resources Management. 
                Currently pursuing dual PhD degrees and leading cutting-edge research in geospatial data science and sustainable water management. 
                Passionate about applying technology to address agricultural and environmental challenges.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="text-emerald-600" size={24} />
                Research Focus
              </h3>
              <p className="text-gray-600 leading-relaxed">
                My research centers on Integrated Water Resources Management, climate change impacts on groundwater recharge, 
                and developing innovative geospatial tools for sustainable agriculture. I lead the Geospatial Data Science and 
                Technology Center (GeoSpaDa Hub) and work on international collaborations across Asia-Pacific regions.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors">
                  <Mail size={18} />
                  <span>juliusijimenez053@yahoo.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors">
                  <MapPin size={18} />
                  <span>Salbang Paoay, Ilocos Norte, Philippines</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors">
                  <Globe size={18} />
                  <span>GeoSpaDa Hub - Center Head</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Current Affiliations</h3>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100">
                <div className="space-y-2 text-gray-700">
                  <div className="font-medium text-emerald-700">Asian Institute of Technology</div>
                  <div className="text-sm">RS&GIS Specialist, Regional Resource Center</div>
                  <div className="font-medium text-emerald-700 mt-3">Mariano Marcos State University</div>
                  <div className="text-sm">Instructor, College of Agriculture</div>
                  <div className="font-medium text-emerald-700 mt-3">GeoSpaDa Hub</div>
                  <div className="text-sm">Center Head/Lead Research</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Current Research Projects</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-emerald-700">IWRM</div>
              <div className="text-sm text-emerald-600">Integrated Water Resources Management for Padsan River Watershed</div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-teal-700">Dynamic DSF</div>
              <div className="text-sm text-teal-600">Web-based Decision Support Framework Development</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-cyan-700">Climate Studies</div>
              <div className="text-sm text-cyan-600">Groundwater Recharge Modeling in Climate Change Context</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-emerald-700">15+</div>
              <div className="text-sm text-emerald-600">Publications</div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-teal-700">PhD x2</div>
              <div className="text-sm text-teal-600">Dual Doctorate</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-cyan-700">7+ Years</div>
              <div className="text-sm text-cyan-600">Teaching Experience</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorProfile;
