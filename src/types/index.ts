export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  type: 'customer' | 'handyman' | 'admin';
  state: string;
  lga: string;
  address?: string;
  profileImage?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface HandymanProfile extends User {
  type: 'handyman';
  skills: string[];
  serviceCategories: ServiceCategory[];
  experience: number;
  certifications: string[];
  portfolio: PortfolioItem[];
  availability: AvailabilitySlot[];
  rating: number;
  totalJobs: number;
  bio: string;
  priceRange: {
    min: number;
    max: number;
  };
  serviceRadius: number; // in kilometers
}

export interface ProfilePictureUpload {
  file: File;
  preview: string;
  isUploading: boolean;
  error?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  completedAt: Date;
}

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  basePrice: number;
  duration: number; // in hours
  isActive: boolean;
}

export type ServiceCategory = 
  | 'plumbing' 
  | 'electrical' 
  | 'carpentry' 
  | 'painting' 
  | 'hvac'
  | 'appliance_repair'
  | 'general_maintenance'
  | 'landscaping'
  | 'roofing'
  | 'flooring'
  | 'tiling' 
  | 'cleaning' 
  | 'generator_repair'
  | 'security_systems'
  | 'masonry'
  | 'welding'
  | 'pest_control';

export interface BookingRequest {
  id: string;
  customerId: string;
  handymanId: string;
  serviceId: string;
  description: string;
  scheduledDate: Date;
  scheduledTime: string;
  location: {
    address: string;
    state: string;
    lga: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: BookingStatus;
  estimatedPrice: number;
  finalPrice?: number;
  createdAt: Date;
  completedAt?: Date;
}

export type BookingStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'disputed';

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  handymanId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  response?: string; // handyman response
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  customerId: string;
  handymanId: string;
  bookingId?: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Wallet {
  userId: string;
  balance: number;
  totalEarnings: number;
  totalWithdrawals: number;
  lastUpdated: Date;
}

export interface AdminStats {
  totalUsers: number;
  totalHandymen: number;
  totalCustomers: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  activeDisputes: number;
}

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe',
  'Zamfara', 'FCT'
];

export const SERVICE_CATEGORIES = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  carpentry: 'Carpentry', 
  painting: 'Painting',
  hvac: 'HVAC (Heating & Cooling)',
  appliance_repair: 'Appliance Repair',
  general_maintenance: 'General Maintenance',
  landscaping: 'Landscaping & Gardening',
  roofing: 'Roofing',
  flooring: 'Flooring',
  tiling: 'Tiling',
  cleaning: 'Cleaning',
  generator_repair: 'Generator Repair',
  security_systems: 'Security Systems',
  masonry: 'Masonry & Brickwork',
  welding: 'Welding & Metalwork',
  pest_control: 'Pest Control'
};