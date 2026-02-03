"use client";

import { useAction, useQuery } from "convex/react";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { api } from "../../convex/_generated/api";

export function PostWriter() {
  const connection = useQuery(api.connections.getDevToConnection);
  const postToDevTo = useAction(api.forem.postToDevTo);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    url?: string;
  } | null>(null);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    setIsPosting(true);
    setMessage(null);

    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const result = await postToDevTo({
        title,
        bodyMarkdown: body,
        tags: tagList,
        published,
      });

      setMessage({
        type: "success",
        text: "Article posted successfully!",
        url: result.url,
      });

      // Optional: Clear form on success
      setTitle("");
      setBody("");
      setTags("");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to post article.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsPosting(false);
    }
  };

  if (!connection) {
    return null; // Don't show the form if not connected
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Write Article</CardTitle>
        <CardDescription>
          Draft and publish your article to Dev.to.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePost} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Your article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isPosting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body (Markdown)</Label>
            <Textarea
              id="body"
              placeholder="Write your article in Markdown..."
              className="min-h-[300px]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              disabled={isPosting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="react, javascript, webdev"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={isPosting}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={published}
              onCheckedChange={(checked) => setPublished(!!checked)}
              disabled={isPosting}
            />
            <Label
              htmlFor="published"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Publish immediately (if unchecked, it will be saved as a draft on
              Dev.to)
            </Label>
          </div>

          {message && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
              className={
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : ""
              }
            >
              <AlertTitle>
                {message.type === "success" ? "Success!" : "Error"}
              </AlertTitle>
              <AlertDescription>
                {message.text}
                {message.url && (
                  <div className="mt-2">
                    <a
                      href={message.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold underline"
                    >
                      View on Dev.to
                    </a>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isPosting}>
            {isPosting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {published ? "Publish to Dev.to" : "Save Draft to Dev.to"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
