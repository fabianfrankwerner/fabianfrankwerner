"use client";

import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="sticky top-0 z-10 bg-black border-b-4 border-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider">DEVTHREADS</h1>
          <SignOutButton />
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <Authenticated>
          <Content />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
    </div>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  return (
    <>
      {isAuthenticated && (
        <button
          className="bg-white text-black px-4 py-2 font-bold border-4 border-white hover:bg-black hover:text-white transition-all duration-150"
          onClick={() => void signOut()}
        >
          LOGOUT
        </button>
      )}
    </>
  );
}

function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="border-4 border-white p-8">
        <h2 className="text-3xl font-bold mb-8 text-center tracking-wider">
          {flow === "signIn" ? "LOGIN" : "REGISTER"}
        </h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            formData.set("flow", flow);
            void signIn("password", formData).catch((error) => {
              setError(error.message);
            });
          }}
        >
          <input
            className="bg-black text-white border-4 border-white p-4 font-mono focus:outline-none focus:bg-white focus:text-black transition-all duration-150"
            type="email"
            name="email"
            placeholder="EMAIL"
            required
          />
          <input
            className="bg-black text-white border-4 border-white p-4 font-mono focus:outline-none focus:bg-white focus:text-black transition-all duration-150"
            type="password"
            name="password"
            placeholder="PASSWORD"
            required
          />
          <button
            className="bg-white text-black p-4 font-bold border-4 border-white hover:bg-black hover:text-white transition-all duration-150"
            type="submit"
          >
            {flow === "signIn" ? "LOGIN" : "REGISTER"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="underline hover:no-underline"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn"
              ? "Need an account? Register"
              : "Have an account? Login"}
          </button>
        </div>
        {error && (
          <div className="mt-4 p-4 border-4 border-red-500 bg-red-500 text-black font-bold">
            ERROR: {error}
          </div>
        )}
      </div>
    </div>
  );
}

function Content() {
  const profile = useQuery(api.myFunctions.getCurrentUserProfile);
  const feed = useQuery(api.myFunctions.getFeed, { limit: 20 });
  const followRequests = useQuery(api.myFunctions.getFollowRequests);
  const [activeTab, setActiveTab] = useState<"feed" | "discover" | "requests">(
    "feed",
  );

  console.log("Content - profile:", profile);
  console.log("Content - feed:", feed);

  if (profile === undefined || feed === undefined) {
    return (
      <div className="text-center mt-16">
        <div className="border-4 border-white p-8 inline-block">
          <p className="text-xl">LOADING...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    console.log("No profile found, showing ProfileSetup");
    return <ProfileSetup />;
  }

  return (
    <div className="space-y-8">
      <div className="border-4 border-white p-4">
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 border-4 border-white font-bold ${
              activeTab === "feed"
                ? "bg-white text-black"
                : "bg-black text-white hover:bg-white hover:text-black"
            }`}
            onClick={() => setActiveTab("feed")}
          >
            FEED
          </button>
          <button
            className={`px-4 py-2 border-4 border-white font-bold ${
              activeTab === "discover"
                ? "bg-white text-black"
                : "bg-black text-white hover:bg-white hover:text-black"
            }`}
            onClick={() => setActiveTab("discover")}
          >
            DISCOVER
          </button>
          {followRequests && followRequests.length > 0 && (
            <button
              className={`px-4 py-2 border-4 border-white font-bold ${
                activeTab === "requests"
                  ? "bg-white text-black"
                  : "bg-black text-white hover:bg-white hover:text-black"
              }`}
              onClick={() => setActiveTab("requests")}
            >
              REQUESTS ({followRequests.length})
            </button>
          )}
        </div>

        {activeTab === "feed" && (
          <div className="space-y-8">
            <CreatePost />
            <Feed posts={feed} />
          </div>
        )}

        {activeTab === "discover" && <UserDiscovery />}

        {activeTab === "requests" && <FollowRequests />}
      </div>
    </div>
  );
}

function ProfileSetup() {
  const createProfile = useMutation(api.myFunctions.createProfile);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Basic validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!displayName.trim()) {
      setError("Display name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Creating profile with:", {
        username: username.trim(),
        displayName: displayName.trim(),
        bio: bio.trim() || undefined,
      });

      const result = await createProfile({
        username: username.trim(),
        displayName: displayName.trim(),
        bio: bio.trim() || undefined,
      });

      console.log("Profile creation result:", result);

      console.log("Profile created successfully");
    } catch (err) {
      console.error("Profile creation error:", err);
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="border-4 border-white p-8">
        <h2 className="text-3xl font-bold mb-8 text-center tracking-wider">
          SETUP PROFILE
        </h2>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <input
            className="w-full bg-black text-white border-4 border-white p-4 font-mono focus:outline-none focus:bg-white focus:text-black transition-all duration-150"
            type="text"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full bg-black text-white border-4 border-white p-4 font-mono focus:outline-none focus:bg-white focus:text-black transition-all duration-150"
            type="text"
            placeholder="DISPLAY NAME"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <textarea
            className="w-full bg-black text-white border-4 border-white p-4 font-mono focus:outline-none focus:bg-white focus:text-black transition-all duration-150 resize-none"
            placeholder="BIO (OPTIONAL)"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <button
            className="w-full bg-white text-black p-4 font-bold border-4 border-white hover:bg-black hover:text-white transition-all duration-150 disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "CREATING..." : "CREATE PROFILE"}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-4 border-4 border-red-500 bg-red-500 text-black font-bold">
            ERROR: {error}
          </div>
        )}
      </div>
    </div>
  );
}

function CreatePost() {
  const createPost = useMutation(api.myFunctions.createPost);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await createPost({ content: content.trim() });
      setContent("");
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-4 border-white p-6">
      <h2 className="text-xl font-bold mb-4 tracking-wider">NEW POST</h2>
      <form onSubmit={(e) => void handleSubmit(e)}>
        <textarea
          className="w-full bg-black text-white border-4 border-white p-4 font-mono focus:outline-none focus:bg-white focus:text-black transition-all duration-150 resize-none"
          placeholder="What's on your mind, developer?"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm">{content.length}/500</span>
          <button
            className="bg-white text-black px-6 py-2 font-bold border-4 border-white hover:bg-black hover:text-white transition-all duration-150 disabled:opacity-50"
            type="submit"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? "POSTING..." : "POST"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Feed({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return (
      <div className="border-4 border-white p-8 text-center">
        <p className="text-xl">NO POSTS YET</p>
        <p className="mt-2">Be the first to post something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-wider">FEED</h2>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }: { post: any }) {
  const toggleLike = useMutation(api.myFunctions.toggleLike);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await toggleLike({ postId: post._id });
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="border-4 border-white p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">@{post.author.username}</h3>
          <p className="text-sm opacity-70">{post.author.displayName}</p>
        </div>
        <span className="text-sm opacity-70">{formatTime(post.createdAt)}</span>
      </div>

      <div className="mb-4">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>

      <div className="flex gap-6 text-sm">
        <button
          className={`flex items-center gap-2 font-bold hover:underline ${
            post.isLiked ? "text-red-500" : ""
          }`}
          onClick={() => void handleLike()}
          disabled={isLiking}
        >
          {post.isLiked ? "♥" : "♡"} {post.likesCount}
        </button>
        <button
          className="flex items-center gap-2 font-bold hover:underline"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {post.commentsCount}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t-2 border-white">
          <Comments postId={post._id} />
        </div>
      )}
    </div>
  );
}

function Comments({ postId }: { postId: any }) {
  const comments = useQuery(api.myFunctions.getComments, { postId });
  const addComment = useMutation(api.myFunctions.addComment);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment({ postId, content: content.trim() });
      setContent("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="space-y-4">
      <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-2">
        <input
          className="flex-1 bg-black text-white border-2 border-white p-2 font-mono focus:outline-none focus:bg-white focus:text-black transition-all duration-150"
          type="text"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={200}
        />
        <button
          className="bg-white text-black px-4 py-2 font-bold border-2 border-white hover:bg-black hover:text-white transition-all duration-150 disabled:opacity-50"
          type="submit"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? "..." : "POST"}
        </button>
      </form>

      {comments && comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="border-2 border-white p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold">@{comment.author.username}</span>
                  <span className="text-sm opacity-70 ml-2">
                    {comment.author.displayName}
                  </span>
                </div>
                <span className="text-xs opacity-70">
                  {formatTime(comment.createdAt)}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UserDiscovery() {
  const [searchUsername, setSearchUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getUserProfile = useQuery(
    api.myFunctions.getUserProfile,
    searchUsername ? { username: searchUsername } : "skip",
  );
  const sendFollowRequest = useMutation(api.myFunctions.sendFollowRequest);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;

    setIsSearching(true);
    setError(null);
    setSearchedUser(null);

    try {
      // The query will automatically run when searchUsername changes
      // We just need to wait for it to complete
    } catch {
      setError("Failed to search for user");
    } finally {
      setIsSearching(false);
    }
  };

  // Update searchedUser when getUserProfile changes
  useEffect(() => {
    if (getUserProfile !== undefined) {
      setSearchedUser(getUserProfile);
      if (getUserProfile === null && searchUsername) {
        setError("User not found");
      } else {
        setError(null);
      }
    }
  }, [getUserProfile, searchUsername]);

  const handleFollow = async () => {
    if (!searchedUser || isFollowing) return;

    setIsFollowing(true);
    try {
      await sendFollowRequest({ toUserId: searchedUser.userId });
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send follow request",
      );
    } finally {
      setIsFollowing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-wider">DISCOVER USERS</h2>

      <form onSubmit={(e) => void handleSearch(e)} className="flex gap-2">
        <input
          className="flex-1 bg-black text-white border-4 border-white p-4 font-mono focus:outline-none focus:bg-white focus:text-black transition-all duration-150"
          type="text"
          placeholder="SEARCH USERNAME"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
        />
        <button
          className="bg-white text-black px-6 py-4 font-bold border-4 border-white hover:bg-black hover:text-white transition-all duration-150 disabled:opacity-50"
          type="submit"
          disabled={isSearching || !searchUsername.trim()}
        >
          {isSearching ? "SEARCHING..." : "SEARCH"}
        </button>
      </form>

      {error && (
        <div className="p-4 border-4 border-red-500 bg-red-500 text-black font-bold">
          ERROR: {error}
        </div>
      )}

      {searchedUser && (
        <div className="border-4 border-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">@{searchedUser.username}</h3>
              <p className="text-lg">{searchedUser.displayName}</p>
              {searchedUser.bio && (
                <p className="mt-2 opacity-70">{searchedUser.bio}</p>
              )}
            </div>
            <button
              className="bg-white text-black px-4 py-2 font-bold border-4 border-white hover:bg-black hover:text-white transition-all duration-150 disabled:opacity-50"
              onClick={() => void handleFollow()}
              disabled={isFollowing}
            >
              {isFollowing ? "SENDING..." : "FOLLOW"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FollowRequests() {
  const followRequests = useQuery(api.myFunctions.getFollowRequests);
  const respondToFollowRequest = useMutation(
    api.myFunctions.respondToFollowRequest,
  );
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  const handleRespond = async (
    requestId: any,
    status: "accepted" | "rejected",
  ) => {
    setRespondingTo(requestId);
    try {
      await respondToFollowRequest({ requestId, status });
    } catch (err) {
      console.error("Failed to respond to follow request:", err);
    } finally {
      setRespondingTo(null);
    }
  };

  if (!followRequests || followRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xl">NO PENDING REQUESTS</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-wider">FOLLOW REQUESTS</h2>

      <div className="space-y-4">
        {followRequests.map((request) => (
          <div key={request._id} className="border-4 border-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">
                  @{request.fromUser.username}
                </h3>
                <p className="text-lg">{request.fromUser.displayName}</p>
                <p className="text-sm opacity-70 mt-2">
                  Requested {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-black px-4 py-2 font-bold border-4 border-green-500 hover:bg-black hover:text-green-500 transition-all duration-150 disabled:opacity-50"
                  onClick={() => void handleRespond(request._id, "accepted")}
                  disabled={respondingTo === request._id}
                >
                  {respondingTo === request._id ? "..." : "ACCEPT"}
                </button>
                <button
                  className="bg-red-500 text-black px-4 py-2 font-bold border-4 border-red-500 hover:bg-black hover:text-red-500 transition-all duration-150 disabled:opacity-50"
                  onClick={() => void handleRespond(request._id, "rejected")}
                  disabled={respondingTo === request._id}
                >
                  {respondingTo === request._id ? "..." : "REJECT"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
