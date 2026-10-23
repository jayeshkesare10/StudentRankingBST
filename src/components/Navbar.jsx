import React from 'react';
import { 
  TreeIcon, 
  ServerIcon, 
  SettingsIcon, 
  BookOpenIcon, 
  PlusIcon, 
  RefreshIcon 
} from './Icons';

export default function Navbar({ 
  backendStatus, 
  isPreviewMode, 
  onTogglePreviewMode, 
  onOpenAddModal, 
  onOpenSettingsModal, 
  onOpenTheoryModal, 
  onRefresh, 
  isRefreshing 
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="navbar-logo-badge">
            <TreeIcon size={24} className="logo-icon" />
          </div>
          <div>
            <div className="navbar-title-row">
              <h1 className="navbar-title">BST Student Ranker</h1>
              <span className="badge badge-primary">C++ Core Engine</span>
            </div>
            <p className="navbar-subtitle">Data Structures Project &bull; Binary Search Tree</p>
          </div>
        </div>

        {/* Center / Status */}
        <div className="navbar-center">
          {/* Status Pill */}
          <div 
            className={`status-pill ${
              isPreviewMode 
                ? 'status-preview' 
                : backendStatus === 'online' 
                  ? 'status-online' 
                  : 'status-offline'
            }`}
            onClick={onOpenSettingsModal}
            title="Click to configure C++ backend URL"
          >
            <span className="status-dot"></span>
            <span className="status-label">
              {isPreviewMode 
                ? 'Preview Mode' 
                : backendStatus === 'online' 
                  ? 'C++ Backend: Online' 
                  : 'C++ Backend: Offline'}
            </span>
            <ServerIcon size={14} className="status-server-icon" />
          </div>

          {/* Preview Mode Switcher */}
          <label className="preview-toggle" title="Toggle simulation mode when C++ server is offline">
            <input 
              type="checkbox" 
              checked={isPreviewMode} 
              onChange={(e) => onTogglePreviewMode(e.target.checked)} 
            />
            <span className="slider"></span>
            <span className="preview-toggle-text">Demo Mode</span>
          </label>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <button 
            type="button" 
            className="btn-icon" 
            onClick={onRefresh} 
            disabled={isRefreshing}
            title="Refresh from C++ Backend"
          >
            <RefreshIcon size={18} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onOpenTheoryModal}
            title="Learn about BST Properties and Time Complexity"
          >
            <BookOpenIcon size={16} />
            <span className="hide-on-mobile">BST Theory</span>
          </button>

          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onOpenSettingsModal}
            title="Configure Backend URL"
          >
            <SettingsIcon size={16} />
            <span className="hide-on-mobile">API Config</span>
          </button>

          <button 
            type="button" 
            className="btn-primary" 
            onClick={onOpenAddModal}
          >
            <PlusIcon size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>
    </header>
  );
}
