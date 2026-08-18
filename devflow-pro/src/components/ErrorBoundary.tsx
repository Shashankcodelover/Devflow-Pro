import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error: Error | null }

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: '20px', background: '#FAECE7', borderRadius: '8px', margin: '16px' }}>
          <h3>Something went wrong</h3>
          <p style={{ color: 'gray', fontSize: '13px' }}>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
