import React, { useState } from 'react';
import { 
  CloseIcon, 
  SettingsIcon, 
  ServerIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  ExternalLinkIcon 
} from './Icons';
import { getApiBaseUrl, setCustomApiBaseUrl } from '../services/api';

export default function ApiSettingsModal({ 
  isOpen, 
  onClose, 
  backendStatus, 
  isPreviewMode, 
  onTogglePreviewMode, 
  onCheckHealth, 
  onShowToast 
}) {
  const [urlInput, setUrlInput] = useState(getApiBaseUrl() || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSaveUrl = (e) => {
    e.preventDefault();
    setCustomApiBaseUrl(urlInput.trim());
    if (onShowToast) {
      onShowToast(`API Base URL saved: ${urlInput.trim() || '(Default)'}`, 'success');
    }
    handleTestConnection();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await onCheckHealth();
      if (res && res.status === 'online') {
        setTestResult({ success: true, message: 'Successfully connected to C++ Backend!' });
      } else if (res && res.status === 'preview') {
        setTestResult({ success: true, message: 'Preview Mode Active. Simulated backend is responsive.' });
      } else {
        setTestResult({ 
          success: false, 
          message: res?.error || 'Could not connect. Ensure your C++ server is running and CORS is enabled.' 
        });
      }
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetDefault = () => {
    setUrlInput('');
    setCustomApiBaseUrl('');
    setTestResult(null);
    if (onShowToast) {
      onShowToast('API URL reset to environment default.', 'info');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <SettingsIcon size={20} />
            </div>
            <div>
              <h3 className="modal-title">C++ Backend Configuration</h3>
              <p className="modal-subtitle">Connect your C++ HTTP server to this frontend</p>
            </div>
          </div>
          <button type="button" className="btn-icon-sm" onClick={onClose}>
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Connection Status Banner */}
          <div className={`config-status-banner ${
            isPreviewMode ? 'banner-preview' : backendStatus === 'online' ? 'banner-online' : 'banner-offline'
          }`}>
            <ServerIcon size={18} />
            <div>
              <strong>
                Status: {isPreviewMode ? 'Preview / Demo Mode Active' : backendStatus === 'online' ? 'C++ Backend Online' : 'Backend Disconnected'}
              </strong>
              <p className="text-xs">
                {isPreviewMode
                  ? 'Simulating C++ BST logic locally for UI exploration.'
                  : backendStatus === 'online'
                    ? 'Frontend is actively communicating with your C++ BST server.'
                    : 'Backend is currently unreachable. Configure your live URL below or toggle Preview Mode.'}
              </p>
            </div>
          </div>

          {/* Toggle Demo Mode Switch */}
          <div className="config-preview-section">
            <div className="preview-info-text">
              <strong>Frontend Demo / Preview Mode</strong>
              <p className="text-xs text-muted">
                Allows testing all UI features, tree visualization, adding and deleting without running the C++ backend.
              </p>
            </div>
            <label className="preview-toggle">
              <input 
                type="checkbox" 
                checked={isPreviewMode} 
                onChange={(e) => {
                  onTogglePreviewMode(e.target.checked);
                  setTestResult(null);
                }} 
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Base URL Form */}
          <form onSubmit={handleSaveUrl} className="config-url-form">
            <div className="form-group">
              <label htmlFor="api-base-url" className="form-label">
                C++ API Base URL
              </label>
              <div className="input-with-button">
                <input
                  id="api-base-url"
                  type="text"
                  placeholder="e.g. http://localhost:8080 or https://your-server.onrender.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="font-mono text-sm"
                />
                <button type="submit" className="btn-primary btn-sm">
                  Save
                </button>
              </div>
              <span className="field-hint">
                Stored in your browser. In production, also configure <code>VITE_API_BASE_URL</code> in your host (Vercel).
              </span>
            </div>

            <div className="config-button-row">
              <button 
                type="button" 
                className="btn-secondary btn-sm"
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                {isTesting ? <span className="btn-spinner-sm"></span> : <ServerIcon size={14} />}
                <span>Ping Connection</span>
              </button>

              <button 
                type="button" 
                className="btn-link text-xs"
                onClick={handleResetDefault}
              >
                Reset to Default
              </button>
            </div>

            {testResult && (
              <div className={`ping-result-box ${testResult.success ? 'ping-success' : 'ping-error'} animate-fade-in`}>
                {testResult.success ? <CheckCircleIcon size={16} /> : <AlertCircleIcon size={16} />}
                <span>{testResult.message}</span>
              </div>
            )}
          </form>

          {/* API Contract Reference */}
          <div className="api-contracts-box">
            <span className="contracts-heading">Expected C++ HTTP API Endpoints:</span>
            <div className="contracts-list font-mono text-xs">
              <div className="contract-item"><span className="method get">GET</span> <code>/api/health</code> &bull; Healthcheck</div>
              <div className="contract-item"><span className="method get">GET</span> <code>/api/students</code> &bull; In-order students list</div>
              <div className="contract-item"><span className="method post">POST</span> <code>/api/students</code> &bull; Insert student into BST</div>
              <div className="contract-item"><span className="method get">GET</span> <code>/api/students/search?q=...</code> &bull; Search BST</div>
              <div className="contract-item"><span className="method del">DELETE</span> <code>/api/students/:rollNo</code> &bull; Delete node</div>
              <div className="contract-item"><span className="method get">GET</span> <code>/api/leaderboard</code> &bull; Sorted ranking</div>
              <div className="contract-item"><span className="method get">GET</span> <code>/api/bst/tree</code> &bull; Hierarchical JSON tree</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
