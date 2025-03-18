
export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  subreddit: string;
  votes: number;
  commentCount: number;
  createdAt: string;
  image?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  votes: number;
  createdAt: string;
  replies?: Comment[];
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
}

export interface Subreddit {
  id: string;
  name: string;
  icon?: string;
  memberCount: number;
  description: string;
}

// Mock users
const users: User[] = [
  {
    id: 'u1',
    username: 'johndoe',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=john'
  },
  {
    id: 'u2',
    username: 'janedoe',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=jane'
  },
  {
    id: 'u3',
    username: 'marksmith',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=mark'
  },
  {
    id: 'u4',
    username: 'sarahconnor',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sarah'
  }
];

// Mock subreddits
export const subreddits: Subreddit[] = [
  {
    id: 's1',
    name: 'programming',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=programming',
    memberCount: 4200000,
    description: 'Discussion about programming languages, tools, and techniques.'
  },
  {
    id: 's2',
    name: 'design',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=design',
    memberCount: 1800000,
    description: 'Share and discuss design work, ideas, and resources.'
  },
  {
    id: 's3',
    name: 'technology',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=technology',
    memberCount: 12500000,
    description: 'For all things technology related.'
  },
  {
    id: 's4',
    name: 'askreddit',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=askreddit',
    memberCount: 35000000,
    description: 'Ask Reddit: a place to ask and answer thought-provoking questions.'
  },
  {
    id: 's5',
    name: 'gaming',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=gaming',
    memberCount: 32000000,
    description: 'A community for gamers of all types.'
  }
];

// Mock posts
export const posts: Post[] = [
  {
    id: 'p1',
    title: 'What are your favorite VS Code extensions for web development?',
    content: "I've been using VS Code for a while, but I feel like I'm not taking full advantage of it. What extensions have made the biggest impact on your productivity?",
    author: users[0],
    subreddit: 'programming',
    votes: 342,
    commentCount: 87,
    createdAt: '2023-05-15T14:32:00Z'
  },
  {
    id: 'p2',
    title: 'Minimalist UI design is taking over - what do you think?',
    content: "I've noticed a trend of ultra-minimalist UI design becoming more popular lately. Everything is flat, with lots of white space and subtle animations. What are your thoughts on this trend? Is it just a passing fad or the future of design?",
    author: users[1],
    subreddit: 'design',
    votes: 189,
    commentCount: 53,
    createdAt: '2023-05-16T09:17:00Z',
    image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'
  },
  {
    id: 'p3',
    title: 'Apple just announced their new AR headset',
    content: "At WWDC today, Apple unveiled their long-awaited AR headset. With a price point of $3,499, it's definitely targeted at developers and early adopters rather than mainstream consumers. What do you think about it? Will it revolutionize computing or fall flat?",
    author: users[2],
    subreddit: 'technology',
    votes: 1542,
    commentCount: 327,
    createdAt: '2023-05-16T18:45:00Z',
    image: 'https://images.unsplash.com/photo-1689179152881-96fb4b8bfb26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'
  },
  {
    id: 'p4',
    title: 'What's your most unpopular technological opinion?',
    content: "We all have some unpopular opinions about technology. Maybe you think a certain programming language is overrated, or a popular device is actually terrible. What's your most controversial tech take? (Keep it civil!)",
    author: users[3],
    subreddit: 'askreddit',
    votes: 892,
    commentCount: 412,
    createdAt: '2023-05-17T11:22:00Z'
  },
  {
    id: 'p5',
    title: 'Just released my first indie game after 2 years of solo development!',
    content: "After countless late nights and weekends, I've finally released my first indie game on Steam! It's a roguelike dungeon crawler with procedurally generated levels. I'd love it if you could check it out and let me know what you think. Here's the trailer link.",
    author: users[0],
    subreddit: 'gaming',
    votes: 2756,
    commentCount: 198,
    createdAt: '2023-05-17T15:08:00Z',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'
  }
];

// Mock comments
export const comments: Record<string, Comment[]> = {
  'p1': [
    {
      id: 'c1',
      content: "I can't recommend Prettier enough. It's saved our team from countless discussions about code formatting!",
      author: users[1],
      votes: 42,
      createdAt: '2023-05-15T15:10:00Z',
      replies: [
        {
          id: 'c1r1',
          content: "Agreed! Combine it with ESLint and you've got a powerful setup.",
          author: users[2],
          votes: 12,
          createdAt: '2023-05-15T15:25:00Z'
        }
      ]
    },
    {
      id: 'c2',
      content: "GitLens is amazing for understanding who changed what and why. Really helps me navigate large codebases.",
      author: users[3],
      votes: 28,
      createdAt: '2023-05-15T15:45:00Z'
    }
  ],
  'p2': [
    {
      id: 'c3',
      content: "I think minimalism can be beautiful when done right, but it's often taken too far. User experience should always come before aesthetic purity.",
      author: users[2],
      votes: 63,
      createdAt: '2023-05-16T10:05:00Z',
      replies: [
        {
          id: 'c3r1',
          content: "Exactly. I've seen too many websites where you can't tell what's a button and what's just decorative text.",
          author: users[0],
          votes: 21,
          createdAt: '2023-05-16T10:18:00Z'
        }
      ]
    }
  ],
  'p3': [
    {
      id: 'c4',
      content: "The price is definitely steep, but remember this is a first-gen product aimed at developers. The tech looks impressive though!",
      author: users[0],
      votes: 87,
      createdAt: '2023-05-16T19:12:00Z'
    },
    {
      id: 'c5',
      content: "I'm skeptical. We've seen so many AR/VR products fail to gain mainstream adoption. What makes this one different?",
      author: users[1],
      votes: 54,
      createdAt: '2023-05-16T19:34:00Z',
      replies: [
        {
          id: 'c5r1',
          content: "Apple's ecosystem and developer community gives them a huge advantage over previous attempts.",
          author: users[3],
          votes: 32,
          createdAt: '2023-05-16T19:48:00Z'
        }
      ]
    }
  ],
  'p4': [
    {
      id: 'c6',
      content: "Here's mine: Mechanical keyboards are overrated and most people buy them for the aesthetics rather than any real productivity benefit.",
      author: users[2],
      votes: 45,
      createdAt: '2023-05-17T11:45:00Z',
      replies: [
        {
          id: 'c6r1',
          content: "I respectfully disagree. Once you get used to a good mechanical keyboard, it's hard to go back to membrane.",
          author: users[1],
          votes: 23,
          createdAt: '2023-05-17T12:02:00Z'
        }
      ]
    }
  ],
  'p5': [
    {
      id: 'c7',
      content: "Just bought it and played for a couple hours. Really impressive for a solo dev! The procedural generation keeps things fresh.",
      author: users[3],
      votes: 78,
      createdAt: '2023-05-17T16:30:00Z'
    },
    {
      id: 'c8',
      content: "Congrats on the launch! What was the hardest part of the development process?",
      author: users[1],
      votes: 41,
      createdAt: '2023-05-17T17:15:00Z'
    }
  ]
};

// Function to get a single post by ID
export const getPostById = (postId: string): Post | undefined => {
  return posts.find(post => post.id === postId);
};

// Function to get comments for a post
export const getCommentsForPost = (postId: string): Comment[] => {
  return comments[postId] || [];
};
