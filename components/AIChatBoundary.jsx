/**
 * Error Boundary for the AI Chat Component
 */
import React from 'react';

class AIChatBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('AI Chat Error caught by boundary:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="ai-chat-error-boundary">
          <h3>Oops, there was an error in the AI Chat!</h3>
          <p>We're sorry, but something went wrong with the AI chat interface.</p>

          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>

          <button
            onClick={() => {
              // Reset the error state and try to recover
              this.setState({ hasError: false, error: null, errorInfo: null });
              // Optionally trigger a re-render of the child component
              window.location.reload(); // This is one way to reset the component
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AIChatBoundary;