'use client';

import React from 'react';

import { ConvexError } from 'convex/values';

import { signOut } from '@/lib/convex/auth-client';

interface Props {
  children: React.ReactNode;
  isAuthenticated?: boolean;
}

interface State {
  error: Error | null;
  hasError: boolean;
}

export class AuthErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error, hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Check if this is an authentication error
    if (error instanceof ConvexError && error.data?.code === 'USER_NOT_FOUND') {
      // Sign out and reload to clear invalid session
      signOut().then(() => {
        window.location.reload();
      });
    } else {
      // Log other errors to error reporting service
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  override render() {
    if (this.state.hasError && this.state.error) {
      const error = this.state.error;

      // Check if it's an authentication error
      if (
        error instanceof ConvexError &&
        error.data?.code === 'USER_NOT_FOUND'
      ) {
        return (
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold">Session Expired</h2>
              <p className="text-muted-foreground">
                Reloading page to refresh your session...
              </p>
            </div>
          </div>
        );
      }

      // Default error UI for other errors
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-muted-foreground">
              Please try refreshing the page.
            </p>
            <button
              className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
