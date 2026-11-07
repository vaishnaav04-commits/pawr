"use client";
import Link from "next/link";
import { useActionState } from "react";
import { authenticate } from "@/app/auth/actions";
import { Button } from "./ui/button";
export function AuthForm({
  mode,
}: {
  mode: "login" | "signup" | "reset" | "update";
}) {
  const [state, action, pending] = useActionState(authenticate, {});
  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="mode" value={mode} />
      {mode === "signup" && (
        <label>
          Your name
          <input
            name="full_name"
            autoComplete="name"
            required
            maxLength={100}
          />
        </label>
      )}
      <label>
        Email address
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </label>
      {mode !== "reset" && (
        <label>
          {mode === "update" ? "New password" : "Password"}
          <input
            type="password"
            name="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
          <span className="mt-2 block text-xs font-normal text-muted">
            At least 8 characters
          </span>
        </label>
      )}
      {state.error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-800"
        >
          {state.error}
        </p>
      )}
      {state.success && (
        <p
          role="status"
          className="rounded-xl bg-green-50 p-3 text-sm text-green-800"
        >
          {state.success}
        </p>
      )}
      <Button className="w-full" disabled={pending}>
        {pending
          ? "One moment…"
          : mode === "signup"
            ? "Create your account"
            : mode === "reset"
              ? "Send reset link"
              : mode === "update"
                ? "Save new password"
                : "Welcome back"}
      </Button>
      {mode === "login" && (
        <Link
          href="/reset-password"
          className="block text-center text-sm text-primary"
        >
          Forgot your password?
        </Link>
      )}
    </form>
  );
}
