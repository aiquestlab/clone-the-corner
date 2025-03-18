import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';
import Subreddit from './models/Subreddit.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample data
const users = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=john'
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=jane'
  },
  {
    username: 'marksmith',
    email: 'mark@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=mark'
  },
  {
    username: 'sarahconnor',
    email: 'sarah@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sarah'
  }
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    await Subreddit.deleteMany();
    
    console.log('Data cleared');
    
    // Create users with hashed passwords
    const createdUsers = [];
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      const newUser = await User.create({
        ...user,
        password: hashedPassword
      });
      
      createdUsers.push(newUser);
    }
    
    console.log('Users created');
    
    // Create subreddits
    const subreddits = [
      {
        name: 'programming',
        description: 'Discussion about programming languages, tools, and techniques.',
        icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=programming',
        creator: createdUsers[0]._id,
        moderators: [createdUsers[0]._id],
        members: [createdUsers[0]._id, createdUsers[1]._id, createdUsers[2]._id],
        memberCount: 3
      },
      {
        name: 'design',
        description: 'Share and discuss design work, ideas, and resources.',
        icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=design',
        creator: createdUsers[1]._id,
        moderators: [createdUsers[1]._id],
        members: [createdUsers[0]._id, createdUsers[1]._id],
        memberCount: 2
      },
      {
        name: 'technology',
        description: 'For all things technology related.',
        icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=technology',
        creator: createdUsers[2]._id,
        moderators: [createdUsers[2]._id],
        members: [createdUsers[0]._id, createdUsers[2]._id, createdUsers[3]._id],
        memberCount: 3
      },
      {
        name: 'askreddit',
        description: 'Ask Reddit: a place to ask and answer thought-provoking questions.',
        icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=askreddit',
        creator: createdUsers[3]._id,
        moderators: [createdUsers[3]._id],
        members: [createdUsers[1]._id, createdUsers[3]._id],
        memberCount: 2
      },
      {
        name: 'gaming',
        description: 'A community for gamers of all types.',
        icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=gaming',
        creator: createdUsers[0]._id,
        moderators: [createdUsers[0]._id],
        members: [createdUsers[0]._id, createdUsers[2]._id, createdUsers[3]._id],
        memberCount: 3
      }
    ];
    
    const createdSubreddits = await Subreddit.insertMany(subreddits);
    
    console.log('Subreddits created');
    
    // Create posts
    const posts = [
      {
        title: 'What are your favorite VS Code extensions for web development?',
        content: "I've been using VS Code for a while, but I feel like I'm not taking full advantage of it. What extensions have made the biggest impact on your productivity?",
        author: createdUsers[0]._id,
        subreddit: createdSubreddits[0]._id,
        votes: 342,
        commentCount: 2,
        createdAt: new Date('2023-05-15T14:32:00Z')
      },
      {
        title: 'Minimalist UI design is taking over - what do you think?',
        content: "I've noticed a trend of ultra-minimalist UI design becoming more popular lately. Everything is flat, with lots of white space and subtle animations. What are your thoughts on this trend? Is it just a passing fad or the future of design?",
        author: createdUsers[1]._id,
        subreddit: createdSubreddits[1]._id,
        votes: 189,
        commentCount: 1,
        createdAt: new Date('2023-05-16T09:17:00Z'),
        image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'
      },
      {
        title: 'Apple just announced their new AR headset',
        content: "At WWDC today, Apple unveiled their long-awaited AR headset. With a price point of $3,499, it's definitely targeted at developers and early adopters rather than mainstream consumers. What do you think about it? Will it revolutionize computing or fall flat?",
        author: createdUsers[2]._id,
        subreddit: createdSubreddits[2]._id,
        votes: 1542,
        commentCount: 2,
        createdAt: new Date('2023-05-16T18:45:00Z'),
        image: 'https://images.unsplash.com/photo-1689179152881-96fb4b8bfb26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'
      },
      {
        title: "What's your most unpopular technological opinion?",
        content: "We all have some unpopular opinions about technology. Maybe you think a certain programming language is overrated, or a popular device is actually terrible. What's your most controversial tech take? (Keep it civil!)",
        author: createdUsers[3]._id,
        subreddit: createdSubreddits[3]._id,
        votes: 892,
        commentCount: 1,
        createdAt: new Date('2023-05-17T11:22:00Z')
      },
      {
        title: 'Just released my first indie game after 2 years of solo development!',
        content: "After countless late nights and weekends, I've finally released my first indie game on Steam! It's a roguelike dungeon crawler with procedurally generated levels. I'd love it if you could check it out and let me know what you think. Here's the trailer link.",
        author: createdUsers[0]._id,
        subreddit: createdSubreddits[4]._id,
        votes: 2756,
        commentCount: 2,
        createdAt: new Date('2023-05-17T15:08:00Z'),
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'
      }
    ];
    
    const createdPosts = await Post.insertMany(posts);
    
    console.log('Posts created');
    
    // Create comments
    const comments = [
      {
        content: "I can't recommend Prettier enough. It's saved our team from countless discussions about code formatting!",
        author: createdUsers[1]._id,
        post: createdPosts[0]._id,
        votes: 42,
        createdAt: new Date('2023-05-15T15:10:00Z')
      },
      {
        content: "GitLens is amazing for understanding who changed what and why. Really helps me navigate large codebases.",
        author: createdUsers[3]._id,
        post: createdPosts[0]._id,
        votes: 28,
        createdAt: new Date('2023-05-15T15:45:00Z')
      },
      {
        content: "I think minimalism can be beautiful when done right, but it's often taken too far. User experience should always come before aesthetic purity.",
        author: createdUsers[2]._id,
        post: createdPosts[1]._id,
        votes: 63,
        createdAt: new Date('2023-05-16T10:05:00Z')
      },
      {
        content: "The price is definitely steep, but remember this is a first-gen product aimed at developers. The tech looks impressive though!",
        author: createdUsers[0]._id,
        post: createdPosts[2]._id,
        votes: 87,
        createdAt: new Date('2023-05-16T19:12:00Z')
      },
      {
        content: "I'm skeptical. We've seen so many AR/VR products fail to gain mainstream adoption. What makes this one different?",
        author: createdUsers[1]._id,
        post: createdPosts[2]._id,
        votes: 54,
        createdAt: new Date('2023-05-16T19:34:00Z')
      },
      {
        content: "Here's mine: Mechanical keyboards are overrated and most people buy them for the aesthetics rather than any real productivity benefit.",
        author: createdUsers[2]._id,
        post: createdPosts[3]._id,
        votes: 45,
        createdAt: new Date('2023-05-17T11:45:00Z')
      },
      {
        content: "Just bought it and played for a couple hours. Really impressive for a solo dev! The procedural generation keeps things fresh.",
        author: createdUsers[3]._id,
        post: createdPosts[4]._id,
        votes: 78,
        createdAt: new Date('2023-05-17T16:30:00Z')
      },
      {
        content: "Congrats on the launch! What was the hardest part of the development process?",
        author: createdUsers[1]._id,
        post: createdPosts[4]._id,
        votes: 41,
        createdAt: new Date('2023-05-17T17:15:00Z')
      }
    ];
    
    const createdComments = await Comment.insertMany(comments);
    
    // Create replies
    const replies = [
      {
        content: "Agreed! Combine it with ESLint and you've got a powerful setup.",
        author: createdUsers[2]._id,
        post: createdPosts[0]._id,
        parentComment: createdComments[0]._id,
        votes: 12,
        createdAt: new Date('2023-05-15T15:25:00Z')
      },
      {
        content: "Exactly. I've seen too many websites where you can't tell what's a button and what's just decorative text.",
        author: createdUsers[0]._id,
        post: createdPosts[1]._id,
        parentComment: createdComments[2]._id,
        votes: 21,
        createdAt: new Date('2023-05-16T10:18:00Z')
      },
      {
        content: "Apple's ecosystem and developer community gives them a huge advantage over previous attempts.",
        author: createdUsers[3]._id,
        post: createdPosts[2]._id,
        parentComment: createdComments[4]._id,
        votes: 32,
        createdAt: new Date('2023-05-16T19:48:00Z')
      },
      {
        content: "I respectfully disagree. Once you get used to a good mechanical keyboard, it's hard to go back to membrane.",
        author: createdUsers[1]._id,
        post: createdPosts[3]._id,
        parentComment: createdComments[5]._id,
        votes: 23,
        createdAt: new Date('2023-05-17T12:02:00Z')
      }
    ];
    
    await Comment.insertMany(replies);
    
    console.log('Comments and replies created');
    console.log('Data import complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    await Subreddit.deleteMany();
    
    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
