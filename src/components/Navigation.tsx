
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu, Settings, GraduationCap, UserCheck } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'instructor', label: 'Instructor', icon: UserCheck },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  const handleMenuClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <SheetHeader className="mb-8">
            <SheetTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              <GraduationCap className="text-blue-600" size={32} />
              Learning Hub
            </SheetTitle>
          </SheetHeader>
          
          <nav className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'hover:bg-white/50 hover:scale-105'
                  }`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          <div className="absolute bottom-8 left-6 right-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 font-medium">
                Classroom Learning Hub
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Interactive Education Platform
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navigation;
