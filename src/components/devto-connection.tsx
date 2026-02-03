"use client";

import { useMutation, useQuery } from "convex/react";
import { CheckCircle2, Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { api } from "../../convex/_generated/api";

export function DevToConnection() {
  const connection = useQuery(api.connections.getDevToConnection);
  const saveKey = useMutation(api.connections.saveDevToKey);

  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;

    setIsSaving(true);
    setMessage(null);

    try {
      await saveKey({ apiKey });
      setMessage({ type: "success", text: "API Key saved successfully!" });
      setApiKey(""); // Clear input on success
    } catch {
      setMessage({ type: "error", text: "Failed to save API Key." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dev.to Connection</CardTitle>
        <CardDescription>
          Connect your Dev.to account to publish articles directly. You can
          generate an API key in your Dev.to settings (Extensions {">"} API
          Keys).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connection ? (
          <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Connected</span>
            {connection.maskedKey && (
              <span className="ml-auto text-sm text-gray-500">
                ({connection.maskedKey})
              </span>
            )}
          </div>
        ) : (
          <div className="rounded-md bg-secondary/50 p-3 text-sm text-muted-foreground">
            Not connected yet.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Dev.to API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isSaving}
            />
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
                {message.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={!apiKey || isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {connection ? "Update API Key" : "Connect Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
