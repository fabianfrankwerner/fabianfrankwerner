"use client";
import { useAuth, useClerk, useSignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
      })

      .catch((err) => {
        setError(
          err.errors?.[0]?.longMessage || "Failed to send password reset code.",
        );
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({
            session: result.createdSessionId,
            navigate: async ({ session }) => {
              if (session?.currentTask) {
                // Check for tasks and navigate to custom UI to help users resolve them
                // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
                console.log(session?.currentTask);
                return;
              }

              router.push("/");
            },
          });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        setError(err.errors?.[0]?.longMessage || "Failed to reset password.");
      });
  }

  return (
    <div>
      <h1>Forgot Password?</h1>
      <form onSubmit={!successfulCreation ? create : reset}>
        {!successfulCreation && (
          <>
            <label htmlFor="email">Provide your email address</label>
            <input
              type="email"
              placeholder="e.g john@doe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button>Send password reset code</button>
            {error && <p>{error}</p>}
          </>
        )}

        {successfulCreation && (
          <>
            <label htmlFor="password">Enter your new password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="code">
              Enter the password reset code that was sent to your email
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <button>Reset</button>
            {error && <p>{error}</p>}
          </>
        )}

        {secondFactor && (
          <p>2FA is required, but this UI does not handle that</p>
        )}
      </form>
    </div>
  );
}
