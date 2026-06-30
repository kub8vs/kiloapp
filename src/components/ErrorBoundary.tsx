import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Punkt integracji dla Sentry/Crashlytics.
    console.error("ErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6 p-8 text-center">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Coś poszło nie tak</h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Spróbuj zrestartować aplikację</p>
          <button
            onClick={() => { window.location.href = "/"; }}
            className="px-8 py-4 bg-foreground text-background rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all"
          >
            Wróć do startu
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
