"use client";

import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SimultanIcon } from "@/components/brand/simultan-icon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (step === "reset" && code.length === 6 && password && !isLoading) {
      const timer = setTimeout(() => {
        formRef.current?.requestSubmit();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [code, password, step, isLoading]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCountingDown && resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else if (resendCooldown === 0) {
      setIsCountingDown(false);
      setResendCooldown(60);
    }
    return () => clearInterval(interval);
  }, [isCountingDown, resendCooldown]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setStep("reset");
      // eslint-disable-next-line
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to send reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || isCountingDown) return;
    setIsResending(true);
    setError("");

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setIsCountingDown(true);
      // eslint-disable-next-line
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setIsVerified(true);
        router.push("/");
      } else {
        setError("Something went wrong. Please try again!");
      }
      // eslint-disable-next-line
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={step === "email" ? handleRequestCode : handleResetPassword}
        ref={formRef}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <SimultanIcon className="size-6" />
              </div>
              <span className="sr-only">Home</span>
            </Link>

            <h1 className="text-xl font-bold">
              {step === "email" ? "Reset Password" : "Enter Password"}
            </h1>
            <FieldDescription>
              {step === "email"
                ? "Enter your email to receive a reset code."
                : `Sent a 6-digit code to ${email}`}
            </FieldDescription>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {step === "email" && (
            <>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner className="size-3" />
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </Field>
            </>
          )}
          {step === "reset" && (
            <>
              <Field>
                <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-0 h-8 w-8 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="otp" className="sr-only">
                  Verification code
                </FieldLabel>
                <InputOTP
                  maxLength={6}
                  id="otp"
                  value={code}
                  onChange={setCode}
                  required
                  containerClassName="justify-center gap-4"
                  disabled={isLoading}
                >
                  <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription className="text-center">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || !isLoaded || isCountingDown}
                    className="underline disabled:opacity-50"
                  >
                    {isResending
                      ? "Resending..."
                      : isCountingDown
                        ? `Resend (${resendCooldown}s)`
                        : "Resend"}
                  </button>
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={
                    isLoading || code.length !== 6 || !password || isVerified
                  }
                >
                  {isLoading ? (
                    <>
                      <Spinner className="size-3" />
                      Resetting...
                    </>
                  ) : isVerified ? (
                    "Verified"
                  ) : (
                    "Reset"
                  )}
                </Button>
              </Field>
            </>
          )}
        </FieldGroup>
      </form>
      {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  );
}
