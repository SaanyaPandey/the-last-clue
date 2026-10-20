import React from 'react';

/**
 * ErrorBoundary Component
 * Catches any unexpected rendering errors and presents a readable, atmospheric
 * error screen with a retry button instead of a silent black screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled rendering error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container" role="alert" style={{ margin: '4rem auto', maxWidth: '600px' }}>
          <h2 className="error-title font-title">INVESTIGATION SYSTEM INTERRUPTED</h2>
          <p style={{ color: '#aba191', fontSize: '0.9rem', lineHeight: 1.6 }}>
            An unexpected error occurred while loading the crime scene workspace:
          </p>
          <pre
            style={{
              background: 'rgba(10, 13, 18, 0.8)',
              border: '1px solid var(--border-burgundy)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              color: '#ff9fb2',
              fontSize: '0.78rem',
              overflowX: 'auto',
              textAlign: 'left'
            }}
          >
            {this.state.error?.message || 'Unknown runtime error'}
          </pre>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              className="btn-retry"
              onClick={this.handleReset}
            >
              Restart Investigation
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
