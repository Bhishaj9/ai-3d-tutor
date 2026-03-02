import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error('[ErrorBoundary] Caught:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#06080a',
                    color: '#e2e8f0',
                    fontFamily: "'Inter', system-ui, sans-serif",
                    zIndex: 9999,
                }}>
                    <div style={{
                        maxWidth: 520,
                        width: '90%',
                        background: 'rgba(30, 41, 59, 0.95)',
                        borderRadius: 16,
                        padding: '32px 28px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 600, color: '#f87171' }}>
                            Something went wrong
                        </h2>
                        <p style={{ margin: '0 0 16px', fontSize: 14, color: '#94a3b8', lineHeight: 1.5 }}>
                            The 3D scene encountered an error and couldn't render. This is usually caused by a missing asset or a WebGL issue.
                        </p>

                        <details style={{
                            textAlign: 'left',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: 8,
                            padding: '12px 14px',
                            marginBottom: 20,
                            fontSize: 12,
                            color: '#94a3b8',
                            maxHeight: 180,
                            overflow: 'auto',
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>
                                Error Details
                            </summary>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {this.state.error?.toString()}
                            </pre>
                            {this.state.errorInfo?.componentStack && (
                                <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#64748b' }}>
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            )}
                        </details>

                        <button
                            onClick={this.handleReload}
                            style={{
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: 8,
                                padding: '10px 28px',
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={e => e.target.style.opacity = '0.85'}
                            onMouseLeave={e => e.target.style.opacity = '1'}
                        >
                            Reload App
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
