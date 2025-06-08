
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus, User } from 'lucide-react';

interface StudentAccount {
  studentNumber: string;
  password: string;
  name: string;
  section: string;
  createdAt: string;
}

interface StudentAuthProps {
  onStudentLogin: (studentNumber: string) => void;
  isLoggedIn: boolean;
  currentStudent: string | null;
  onLogout: () => void;
}

const StudentAuth: React.FC<StudentAuthProps> = ({ 
  onStudentLogin, 
  isLoggedIn, 
  currentStudent, 
  onLogout 
}) => {
  const [loginData, setLoginData] = useState({ studentNumber: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    studentNumber: '', 
    password: '', 
    confirmPassword: '',
    name: '',
    section: '' 
  });
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();

  const getStoredAccounts = (): StudentAccount[] => {
    const stored = localStorage.getItem('studentAccounts');
    return stored ? JSON.parse(stored) : [];
  };

  const saveAccount = (account: StudentAccount) => {
    const accounts = getStoredAccounts();
    accounts.push(account);
    localStorage.setItem('studentAccounts', JSON.stringify(accounts));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const accounts = getStoredAccounts();
    const account = accounts.find(
      acc => acc.studentNumber === loginData.studentNumber && acc.password === loginData.password
    );

    if (account) {
      onStudentLogin(account.studentNumber);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${account.name}!`,
      });
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid student number or password.',
        variant: 'destructive',
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: 'Registration Failed',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: 'Registration Failed',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    const accounts = getStoredAccounts();
    const existingAccount = accounts.find(acc => acc.studentNumber === registerData.studentNumber);

    if (existingAccount) {
      toast({
        title: 'Registration Failed',
        description: 'Student number already exists.',
        variant: 'destructive',
      });
      return;
    }

    const newAccount: StudentAccount = {
      studentNumber: registerData.studentNumber,
      password: registerData.password,
      name: registerData.name,
      section: registerData.section,
      createdAt: new Date().toISOString(),
    };

    saveAccount(newAccount);
    toast({
      title: 'Registration Successful',
      description: 'Account created successfully! You can now login.',
    });

    setRegisterData({ 
      studentNumber: '', 
      password: '', 
      confirmPassword: '',
      name: '',
      section: '' 
    });
    setActiveTab('login');
  };

  if (isLoggedIn && currentStudent) {
    const accounts = getStoredAccounts();
    const account = accounts.find(acc => acc.studentNumber === currentStudent);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Portal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                Logged in as: <span className="font-semibold">{account?.name || currentStudent}</span>
              </p>
              <p className="text-sm text-green-600">
                Student Number: {currentStudent}
              </p>
              {account?.section && (
                <p className="text-sm text-green-600">
                  Section: {account.section}
                </p>
              )}
            </div>
            <Button onClick={onLogout} variant="outline" className="w-full">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Student Portal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="loginStudentNumber">Student Number</Label>
                <Input
                  id="loginStudentNumber"
                  type="text"
                  value={loginData.studentNumber}
                  onChange={(e) => setLoginData({...loginData, studentNumber: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="loginPassword">Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="registerStudentNumber">Student Number</Label>
                <Input
                  id="registerStudentNumber"
                  type="text"
                  value={registerData.studentNumber}
                  onChange={(e) => setRegisterData({...registerData, studentNumber: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="registerName">Full Name</Label>
                <Input
                  id="registerName"
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="registerSection">Section</Label>
                <Input
                  id="registerSection"
                  type="text"
                  value={registerData.section}
                  onChange={(e) => setRegisterData({...registerData, section: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="registerPassword">Password</Label>
                <Input
                  id="registerPassword"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StudentAuth;
