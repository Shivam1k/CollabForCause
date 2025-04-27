// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'volunteer' | 'ngo';
  skills?: string[];
  bio?: string;
  location?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Project types
export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  deadline: string;
  status: 'active' | 'completed' | 'cancelled';
  image?: string;
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}

// Task types
export interface Task {
  _id: string;
  project: string | Project;
  title: string;
  description: string;
  skills: string[];
  deadline: string;
  status: 'open' | 'claimed' | 'submitted' | 'completed';
  claimedBy?: string | User;
  submissionLink?: string;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

// Contribution types
export interface Contribution {
  _id: string;
  task: string | Task;
  project: string | Project;
  volunteer: string | User;
  submissionLink: string;
  status: 'submitted' | 'approved' | 'rejected';
  feedback?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Message types
export interface Message {
  _id: string;
  project: string | Project;
  sender: string | User;
  content: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}