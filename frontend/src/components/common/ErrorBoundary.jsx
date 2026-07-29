import React from 'react';
import { AlertOctagon, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Ideally, send this to your telemetry/logging service (e.g., Sentry)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] h-full w-full flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl border-dashed">
          <div className="p-4 bg-red-50 rounded-full mb-4">
            <AlertOctagon size={40} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Component Crashed</h2>
          <p className="text-sm text-slate-500 text-center max-w-md mb-6">
            A rendering error occurred in this section of the dashboard. The rest of the platform remains operational.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RefreshCcw size={16} />
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;