export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  type: 'customer' | 'handyman' | 'service_provider' | 'admin' | 'super_admin';
  state: string;
  lga: string;
  address?: string;
  profileImage?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface HandymanProfile extends User {
  type: 'service_provider';
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
  | 'beauty_pedicure_manicure'
  | 'beauty_lashes'
  | 'beauty_massage'
  | 'beauty_haircut'
  | 'beauty_hair_styling'
  | 'beauty_makeup'
  | 'beauty_wig_revamp'
  | 'beauty_tattoo'
  | 'beauty_piercings'
  | 'electrical_house_wiring'
  | 'electrical_auto_electrician'
  | 'electrical_home_electrician'
  | 'electrical_appliance_repair'
  | 'carpentry_roofing'
  | 'carpentry_furniture'
  | 'events_planning'
  | 'events_ushering'
  | 'events_catering'
  | 'rentals'
  | 'plumbing'
  | 'drivers'
  | 'caretakers'
  | 'chef'
  | 'cleaning_industrial'
  | 'cleaning_home'
  | 'cleaning_deep'
  | 'cleaning_hotel'
  | 'web_developer'
  | 'computer_engineer'
  | 'mobile_phone_technician'
  | 'human_resource'
  | 'courier_services'
  | 'haulage_services'
  | 'civil_engineers'
  | 'architectural_services'
  | 'social_media_content_creators'
  | 'social_media_page_management'
  | 'agricultural_farmers'
  | 'agricultural_labourers'
  | 'agricultural_farm_managers'
  | 'security_trained_guards'
  | 'security_police_escort'
  | 'security_vigilante'
  | 'security_bouncers'
  | 'medical_general_consultation'
  | 'medical_advice'
  | 'legal_services'
  | 'therapy_psychologist'
  | 'therapy_psychiatrist'
  | 'fitness_gym_instructor'
  | 'fitness_dietitian'
  | 'fitness_coach'
  | 'educational_private_teacher'
  | 'educational_forex'
  | 'educational_coding';

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
  totalServiceProviders: number;
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
  beauty_pedicure_manicure: 'Beauty & Spa - Pedicure & Manicure',
  beauty_lashes: 'Beauty & Spa - Lashes',
  beauty_massage: 'Beauty & Spa - Massage',
  beauty_haircut: 'Beauty & Spa - Haircut',
  beauty_hair_styling: 'Beauty & Spa - Hair Styling',
  beauty_makeup: 'Beauty & Spa - Makeup',
  beauty_wig_revamp: 'Beauty & Spa - Wig Revamp',
  beauty_tattoo: 'Beauty & Spa - Tattoo',
  beauty_piercings: 'Beauty & Spa - Piercings',
  electrical_house_wiring: 'Electricals - House Wiring',
  electrical_auto_electrician: 'Electricals - Auto Electrician',
  electrical_home_electrician: 'Electricals - Home Electrician',
  electrical_appliance_repair: 'Electricals - Appliance Repair',
  carpentry_roofing: 'Carpentry - Roofing',
  carpentry_furniture: 'Carpentry - Furniture',
  events_planning: 'Events - Event Planning',
  events_ushering: 'Events - Ushering',
  events_catering: 'Events - Catering',
  rentals: 'Rentals',
  plumbing: 'Plumbing',
  drivers: 'Drivers',
  caretakers: 'Caretakers',
  chef: 'Chef',
  cleaning_industrial: 'Cleaning Services - Industrial Cleaning',
  cleaning_home: 'Cleaning Services - Home Cleaning',
  cleaning_deep: 'Cleaning Services - Deep Cleaning',
  cleaning_hotel: 'Cleaning Services - Hotel Cleaning',
  web_developer: 'Web Developer',
  computer_engineer: 'Computer Engineer',
  mobile_phone_technician: 'Mobile Phone Technician',
  human_resource: 'Human Resource Services',
  courier_services: 'Courier Services',
  haulage_services: 'Haulage Services',
  civil_engineers: 'Civil Engineers',
  architectural_services: 'Architectural Services',
  social_media_content_creators: 'Social Media - Content Creators',
  social_media_page_management: 'Social Media - Page Handlers & Managers',
  agricultural_farmers: 'Agricultural Services - Farmers',
  agricultural_labourers: 'Agricultural Services - Labourers',
  agricultural_farm_managers: 'Agricultural Services - Farm Managers',
  security_trained_guards: 'Security Services - Trained Guards',
  security_police_escort: 'Security Services - Police Escort',
  security_vigilante: 'Security Services - Vigilante',
  security_bouncers: 'Security Services - Bouncers',
  medical_general_consultation: 'Medical Services - General Consultation',
  medical_advice: 'Medical Services - Medical Advice & Recommendations',
  legal_services: 'Legal Services',
  therapy_psychologist: 'Therapy - Psychologist',
  therapy_psychiatrist: 'Therapy - Psychiatrist',
  fitness_gym_instructor: 'Fitness & Wellness - Gym Instructor',
  fitness_dietitian: 'Fitness & Wellness - Dietitian',
  fitness_coach: 'Fitness & Wellness - Coach',
  educational_private_teacher: 'Educational - Private Teacher',
  educational_forex: 'Educational - Forex',
  educational_coding: 'Educational - Coding'
};