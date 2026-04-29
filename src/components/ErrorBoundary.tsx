"use client";

import React from "react";
import { IoWarningOutline, IoRefreshOutline, IoHomeOutline } from "react-icons/io5";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <IoWarningOutline className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Something Went Wrong
            </h2>
            <p className="text-[#9CA3AF] text-sm mb-6">
              We encountered an unexpected error. Please try refreshing the page
              or go back to the home page.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="text-left text-xs text-red-400/60 bg-red-500/5 rounded-xl p-4 mb-6 overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white"
              >
                <IoRefreshOutline className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="rounded-full border-[#2E2E38] text-[#9CA3AF]"
                >
                  <IoHomeOutline className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
