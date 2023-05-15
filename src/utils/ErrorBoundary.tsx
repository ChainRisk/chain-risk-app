import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface ErrorBoundaryInnerProps {
  hasError: boolean;
  setHasError: (hasError: boolean) => void;
  children: ReactNode;
  fallback: React.ComponentType<{ error: Error }>;
}

interface ErrorBoundaryInnerState {
  error: Error | null;
}

class ErrorBoundaryInner extends React.Component<
  ErrorBoundaryInnerProps,
  ErrorBoundaryInnerState
> {
  constructor(props: ErrorBoundaryInnerProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryInnerState {
    return { error: _error };
  }

  componentDidUpdate(
    prevProps: ErrorBoundaryInnerProps,
    _previousState: ErrorBoundaryInnerState,
  ): void {
    if (!this.props.hasError && prevProps.hasError) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo): void {
    this.props.setHasError(true);
  }

  render(): ReactNode {
    return this.state.error ? (
      <this.props.fallback error={this.state.error} />
    ) : (
      this.props.children
    );
  }
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: React.ComponentType<{ error: Error }>;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (hasError) {
      setHasError(false);
    }
  }, [location.key]);

  return (
    <ErrorBoundaryInner hasError={hasError} setHasError={setHasError} fallback={fallback}>
      {children}
    </ErrorBoundaryInner>
  );
};

export default ErrorBoundary;
