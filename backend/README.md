# Reddit Clone Backend

This is the backend API for the Reddit Clone project. It provides all the necessary endpoints to support the frontend application.

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling tool
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing library

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd clone-the-corner/backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root of the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/reddit-clone
   JWT_SECRET=your_jwt_secret
   ```

### Running the Server

```
npm run dev
```

The server will start on port 5000 (or the port specified in your .env file).

### Seeding the Database

To populate the database with sample data:

```
npm run seed
```

To clear all data from the database:

```
npm run seed:destroy
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (protected)
- `GET /api/users/:username` - Get user by username

### Posts

- `GET /api/posts` - Get all posts (with optional filters)
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post (protected)
- `PUT /api/posts/:id` - Update a post (protected)
- `DELETE /api/posts/:id` - Delete a post (protected)
- `POST /api/posts/:id/vote` - Vote on a post (protected)

### Comments

- `GET /api/comments/post/:postId` - Get all comments for a post
- `POST /api/comments` - Create a new comment (protected)
- `PUT /api/comments/:id` - Update a comment (protected)
- `DELETE /api/comments/:id` - Delete a comment (protected)
- `POST /api/comments/:id/vote` - Vote on a comment (protected)

### Subreddits

- `GET /api/subreddits` - Get all subreddits (with optional filters)
- `GET /api/subreddits/trending` - Get trending subreddits
- `GET /api/subreddits/:name` - Get a specific subreddit by name
- `POST /api/subreddits` - Create a new subreddit (protected)
- `PUT /api/subreddits/:id` - Update a subreddit (protected)
- `POST /api/subreddits/:id/membership` - Join or leave a subreddit (protected)

## Models

### User

- `username`: String (required, unique)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `avatar`: String
- `karma`: Number
- `createdAt`: Date

### Post

- `title`: String (required)
- `content`: String (required)
- `author`: User reference
- `subreddit`: Subreddit reference
- `votes`: Number
- `commentCount`: Number
- `image`: String (optional)
- `createdAt`: Date

### Comment

- `content`: String (required)
- `author`: User reference
- `post`: Post reference
- `parentComment`: Comment reference (optional, for replies)
- `votes`: Number
- `createdAt`: Date

### Subreddit

- `name`: String (required, unique)
- `description`: String
- `creator`: User reference
- `moderators`: [User reference]
- `members`: [User reference]
- `memberCount`: Number
- `icon`: String (optional)
- `banner`: String (optional)
- `rules`: [{ title: String, description: String }]
- `createdAt`: Date
