import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ServiceCategory } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & {
    password: string;
    serviceCategories?: ServiceCategory[];
    profilePicture?: File | null;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'customer@test.com',
    password: 'password',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+2348012345678',
    type: 'customer',
    state: 'Lagos',
    lga: 'Lagos Island',
    address: '123 Victoria Island, Lagos',
    isVerified: true,
    createdAt: new Date()
  },
  {
    id: '2',
    email: 'handyman@test.com',
    password: 'password',
    firstName: 'Ahmed',
    lastName: 'Ibrahim',
    phone: '+2348087654321',
    type: 'service_provider',
    state: 'Lagos',
    lga: 'Surulere',
    address: '456 Surulere, Lagos',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isVerified: true,
    createdAt: new Date()
  },
  {
    id: '3',
    email: 'admin@test.com',
    password: 'password',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+2348099999999',
    type: 'admin',
    state: 'FCT',
    lga: 'Abuja',
    isVerified: true,
    createdAt: new Date()
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      setLoading(false);
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setLoading(false);
  };

  const register = async (userData: Partial<User> & { 
    password: string; 
    serviceCategories?: ServiceCategory[];
    profilePicture?: File | null;
  }) => {
    setLoading(true);
    
    // Simulate profile picture upload
    let profileImageUrl = null;
    if (userData.profilePicture) {
      // In a real app, this would upload to a cloud storage service
      profileImageUrl = URL.createObjectURL(userData.profilePicture);
    }
    
    // Mock registration with enhanced data
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      phone: userData.phone!,
      type: userData.type!,
      state: userData.state!,
      lga: userData.lga!,
      address: userData.address,
      profileImage: profileImageUrl,
      isVerified: false,
      createdAt: new Date()
    };

    // Store additional handyman data (in a real app, this would go to a separate handyman_profiles table)
    if (userData.type === 'service_provider' && userData.serviceCategories) {
      localStorage.setItem(`service_provider_profile_${newUser.id}`, JSON.stringify({
        serviceCategories: userData.serviceCategories,
        skills: userData.serviceCategories, // For backward compatibility
        experience: 0,
        rating: 0,
        totalJobs: 0
      }));
    }

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}