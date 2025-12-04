# DEVTHREADS - A Brutalistic Developer Social Platform

A minimal, brutalistic threads clone built for developer content using Vite, React, and Convex.

## Features

- ✅ **User Authentication** - Sign up and sign in with email/password
- ✅ **User Profiles** - Create profiles with username, display name, and bio
- ✅ **Follow System** - Send follow requests and manage connections
- ✅ **Posts** - Create and share text-based posts
- ✅ **Likes** - Like and unlike posts
- ✅ **Comments** - Comment on posts with threaded discussions
- ✅ **Feed** - View posts from users you follow
- ✅ **User Discovery** - Search for and follow other developers

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Convex (database, real-time sync, serverless functions)
- **Authentication**: Convex Auth
- **Styling**: Tailwind CSS with brutalistic design
- **Deployment**: Convex Cloud

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up Convex**:

   ```bash
   npx convex dev
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

## Design Philosophy

DEVTHREADS embraces a brutalistic design aesthetic:

- **Black and white color scheme** with high contrast
- **Monospace typography** for a developer-focused feel
- **Bold borders and sharp edges** for a raw, unpolished look
- **Minimal animations** with quick, snappy transitions
- **Functional over beautiful** - every element serves a purpose

## Project Structure

```
src/
├── App.tsx          # Main application component
├── index.css        # Brutalistic styling
└── main.tsx         # Application entry point

convex/
├── schema.ts        # Database schema
├── myFunctions.ts   # Convex functions (queries, mutations)
├── auth.ts          # Authentication configuration
└── http.ts          # HTTP routes
```

## Key Components

- **ProfileSetup** - First-time user profile creation
- **CreatePost** - Post creation form
- **Feed** - Timeline of posts from followed users
- **PostCard** - Individual post display with likes and comments
- **Comments** - Comment system for posts
- **UserDiscovery** - Search and follow other users
- **FollowRequests** - Manage incoming follow requests

## Database Schema

- **profiles** - User profile information
- **posts** - User posts with content and metadata
- **comments** - Comments on posts
- **likes** - Post likes by users
- **followRequests** - Follow relationships and requests

## Contributing

This is a learning project demonstrating modern full-stack development with Convex. Feel free to fork and extend with additional features like:

- Image uploads for posts
- Real-time notifications
- User mentions and hashtags
- Post search and filtering
- Advanced user profiles

## Learn More

- [Convex Documentation](https://docs.convex.dev/)
- [Convex Auth](https://labs.convex.dev/auth)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
