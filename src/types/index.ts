// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  karma: number;
  createdAt: string;
}

// Post types
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User | string;
  subreddit: Subreddit | string;
  votes: number;
  commentCount: number;
  image?: string;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
}

// Comment types
export interface Comment {
  _id: string;
  content: string;
  author: User | string;
  post: Post | string;
  parentComment?: Comment | string;
  votes: number;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
  replies?: Comment[];
}

// Subreddit types
export interface Subreddit {
  _id: string;
  name: string;
  description?: string;
  creator: User | string;
  moderators: (User | string)[];
  members: (User | string)[];
  memberCount: number;
  icon?: string;
  banner?: string;
  rules?: SubredditRule[];
  createdAt: string;
}

export interface SubredditRule {
  title: string;
  description: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  error?: string;
}

// Query params
export interface PostQueryParams {
  page?: number;
  limit?: number;
  sort?: 'hot' | 'new' | 'top';
  subreddit?: string;
  author?: string;
  search?: string;
}

export interface CommentQueryParams {
  page?: number;
  limit?: number;
  sort?: 'new' | 'top';
  post: string;
  parentComment?: string;
}

export interface SubredditQueryParams {
  page?: number;
  limit?: number;
  sort?: 'new' | 'top' | 'trending';
  search?: string;
}

// Component props
export interface PostCardProps {
  post: Post;
}

export interface PostDetailProps {
  post: Post;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  onVotePost: (voteType: 'up' | 'down') => Promise<void>;
  onVoteComment: (commentId: string, voteType: 'up' | 'down') => Promise<void>;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

// Context types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  openAuthModal: (view?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'register';
}
