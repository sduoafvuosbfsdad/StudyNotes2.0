import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Keep logs in devtools for easier debugging in production incidents.
    console.error('Unhandled application error:', error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1>
          <p className="mb-5 text-sm text-muted-foreground">
            An unexpected render error occurred. You can retry without reloading the entire site.
          </p>
          <Button onClick={this.handleRetry} className="mx-auto" type="button">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
          {this.state.error?.message ? (
            <p className="mt-4 text-xs text-muted-foreground">{this.state.error.message}</p>
          ) : null}
        </div>
      </div>
    );
  }
}
