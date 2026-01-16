"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Schedule Your Social Media
              <br />
              <span className="text-primary">In Real-Time</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Create, edit, and schedule posts across X and LinkedIn with
              real-time collaboration. No more manual saves—your changes sync
              instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      <Separator />

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold">Powerful Features</h2>
            <p className="text-muted-foreground">
              Everything you need to manage your social media presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>Real-Time Editing</CardTitle>
                  <Badge variant="secondary">Convex</Badge>
                </div>
                <CardDescription>
                  Collaborate in real-time. Edit your posts in one tab and see
                  changes instantly in another.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Powered by Convex for instant synchronization across all your
                  devices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>Multi-Platform</CardTitle>
                  <Badge variant="secondary">X & LinkedIn</Badge>
                </div>
                <CardDescription>
                  Schedule posts to X (Twitter) and LinkedIn from one unified
                  interface.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Manage all your social media accounts in a single, streamlined
                  workflow.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>Zen Editor</CardTitle>
                  <Badge variant="secondary">Markdown</Badge>
                </div>
                <CardDescription>
                  Write with a distraction-free editor that supports Markdown
                  and live preview.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Focus on your content with a clean, intuitive writing
                  experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>Media Management</CardTitle>
                  <Badge variant="secondary">Storage</Badge>
                </div>
                <CardDescription>
                  Upload and manage images with drag-and-drop support. All media
                  stored securely.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Built-in file storage with optimized image handling for your
                  posts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground">
              Join today and start scheduling your social media posts with ease.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="w-full sm:w-auto">
                Create Account
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>
    </div>
  );
}
