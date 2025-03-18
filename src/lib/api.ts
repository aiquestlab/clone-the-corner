import { toast } from "sonner";

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Set token in localStorage
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Get user from localStorage
export const getUser = () => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

// Set user in localStorage
export const setUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
export const removeUser = (): void => {
  localStorage.removeItem('user');
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return !!getToken();
};

// API request helper
const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  data: any = null,
  requiresAuth: boolean = false
) => {
  try {
    const url = `${API_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if required
    if (requiresAuth) {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
    };

    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return responseData;
  } catch (error: any) {
    // Show error toast
    toast.error(error.message || 'API request failed');
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const data = await apiRequest('/users/login', 'POST', credentials);
    // Save token and user data
    setToken(data.token);
    setUser(data);
    return data;
  },
  
  register: async (userData: RegisterData) => {
    const data = await apiRequest('/users/register', 'POST', userData);
    // Save token and user data
    setToken(data.token);
    setUser(data);
    return data;
  },
  
  logout: () => {
    removeToken();
    removeUser();
  },
  
  getProfile: async () => {
    return await apiRequest('/users/profile', 'GET', null, true);
  },
  
  getUserByUsername: async (username: string) => {
    return await apiRequest(`/users/${username}`, 'GET');
  }
};

// Posts API
export const postsAPI = {
  getPosts: async (params: { sort?: string; page?: number; limit?: number; subreddit?: string } = {}) => {
    const { sort = 'hot', page = 1, limit = 10, subreddit } = params;
    let query = `?sort=${sort}&page=${page}&limit=${limit}`;
    
    if (subreddit) {
      query += `&subreddit=${subreddit}`;
    }
    
    return await apiRequest(`/posts${query}`, 'GET', null, isLoggedIn());
  },
  
  getPostById: async (id: string) => {
    return await apiRequest(`/posts/${id}`, 'GET', null, isLoggedIn());
  },
  
  createPost: async (postData: { title: string; content: string; subredditId: string; image?: string }) => {
    return await apiRequest('/posts', 'POST', postData, true);
  },
  
  updatePost: async (id: string, postData: { title?: string; content?: string; image?: string }) => {
    return await apiRequest(`/posts/${id}`, 'PUT', postData, true);
  },
  
  deletePost: async (id: string) => {
    return await apiRequest(`/posts/${id}`, 'DELETE', null, true);
  },
  
  votePost: async (id: string, vote: 1 | -1) => {
    return await apiRequest(`/posts/${id}/vote`, 'POST', { vote }, true);
  }
};

// Comments API
export const commentsAPI = {
  getCommentsByPost: async (postId: string) => {
    return await apiRequest(`/comments/post/${postId}`, 'GET', null, isLoggedIn());
  },
  
  createComment: async (commentData: { content: string; postId: string; parentCommentId?: string }) => {
    return await apiRequest('/comments', 'POST', commentData, true);
  },
  
  updateComment: async (id: string, content: string) => {
    return await apiRequest(`/comments/${id}`, 'PUT', { content }, true);
  },
  
  deleteComment: async (id: string) => {
    return await apiRequest(`/comments/${id}`, 'DELETE', null, true);
  },
  
  voteComment: async (id: string, vote: 1 | -1) => {
    return await apiRequest(`/comments/${id}/vote`, 'POST', { vote }, true);
  }
};

// Subreddits API
export const subredditsAPI = {
  getSubreddits: async (params: { sort?: string; page?: number; limit?: number; search?: string } = {}) => {
    const { sort = 'members', page = 1, limit = 10, search } = params;
    let query = `?sort=${sort}&page=${page}&limit=${limit}`;
    
    if (search) {
      query += `&search=${search}`;
    }
    
    return await apiRequest(`/subreddits${query}`, 'GET');
  },
  
  getSubredditByName: async (name: string) => {
    return await apiRequest(`/subreddits/${name}`, 'GET', null, isLoggedIn());
  },
  
  createSubreddit: async (subredditData: { name: string; description: string }) => {
    return await apiRequest('/subreddits', 'POST', subredditData, true);
  },
  
  updateSubreddit: async (id: string, subredditData: { description?: string; icon?: string; banner?: string; rules?: Array<{ title: string; description: string }> }) => {
    return await apiRequest(`/subreddits/${id}`, 'PUT', subredditData, true);
  },
  
  joinSubreddit: async (id: string) => {
    return await apiRequest(`/subreddits/${id}/membership`, 'POST', { action: 'join' }, true);
  },
  
  leaveSubreddit: async (id: string) => {
    return await apiRequest(`/subreddits/${id}/membership`, 'POST', { action: 'leave' }, true);
  },
  
  getTrendingSubreddits: async () => {
    return await apiRequest('/subreddits/trending', 'GET');
  }
};
