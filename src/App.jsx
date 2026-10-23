import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import StatCards from './components/StatCards';
import BSTVisualizer from './components/BSTVisualizer';
import StudentTable from './components/StudentTable';
import Leaderboard from './components/Leaderboard';
import SearchBar from './components/SearchBar';
import AddStudentModal from './components/AddStudentModal';
import DeleteModal from './components/DeleteModal';
import ApiSettingsModal from './components/ApiSettingsModal';
import BSTTheoryModal from './components/BSTTheoryModal';
import Toast from './components/Toast';
import { 
  TreeIcon, 
  UsersIcon, 
  TrophyIcon, 
  AlertCircleIcon, 
  SettingsIcon, 
  SparklesIcon, 
  PlusIcon 
} from './components/Icons';
import { 
  checkBackendHealth, 
  getStudents, 
  getLeaderboard, 
  getBSTTree, 
  getStats, 
  addStudent, 
  deleteStudent, 
  getIsPreviewMode, 
  setIsPreviewMode, 
  getApiBaseUrl 
} from './services/api';
import './App.css';

export default function App() {
  // Navigation & View Tab
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'table' | 'leaderboard'
  
  // Data States
  const [students, setStudents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [treeData, setTreeData] = useState(null);
  const [stats, setStats] = useState(null);

  // Status & Modes
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'preview'
  const [isPreviewMode, setIsPreviewModeState] = useState(getIsPreviewMode());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendError, setBackendError] = useState(null);

  // Selected Student for Highlight in Tree / Inspector
  const [highlightRollNo, setHighlightRollNo] = useState(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTheoryModalOpen, setIsTheoryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const visualizerSectionRef = useRef(null);

  const showToast = (message, type = 'info', duration = 4500) => {
    setToast({ message, type, duration });
  };

  // Main data fetch coordinator
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setIsRefreshing(true);
    setBackendError(null);

    // 1. Health check
    const health = await checkBackendHealth();
    setBackendStatus(health.status);

    if (health.status === 'offline' && !getIsPreviewMode()) {
      setBackendError(
        health.error || `Could not connect to C++ backend at ${getApiBaseUrl() || '(no URL set)'}`
      );
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      // 2. Concurrently fetch students, leaderboard, tree, and stats
      const [studentsRes, leaderboardRes, treeRes, statsRes] = await Promise.all([
        getStudents(),
        getLeaderboard(),
        getBSTTree(),
        getStats()
      ]);

      setStudents(studentsRes.students || []);
      setLeaderboard(leaderboardRes.leaderboard || []);
      setTreeData(treeRes.tree || null);
      setStats(statsRes.stats || null);
    } catch (err) {
      console.error('Failed to load BST data:', err);
      setBackendError(err.message);
      if (!isSilent) {
        showToast(err.message, 'error');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Mode switcher handler
  const handleTogglePreviewMode = (enabled) => {
    setIsPreviewMode(enabled);
    setIsPreviewModeState(enabled);
    if (enabled) {
      showToast('Switched to Demo / Preview Mode. Simulating BST in-memory.', 'info');
    } else {
      showToast('Preview Mode disabled. Connecting to C++ HTTP backend.', 'info');
    }
    loadData();
  };

  // Add student action
  const handleAddStudent = async (studentData) => {
    setIsSubmitting(true);
    try {
      const result = await addStudent(studentData);
      setIsAddModalOpen(false);
      const isSim = result.isPreview ? ' (Demo Mode)' : '';
      showToast(`Student #${studentData.rollNo} "${studentData.name}" inserted into BST${isSim}!`, 'success');
      setHighlightRollNo(studentData.rollNo);
      await loadData(true);
      // Switch to tree view to inspect the newly inserted node
      setActiveTab('tree');
    } catch (err) {
      showToast(`Failed to add student: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete student request
  const handleDeleteRequest = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete student action
  const handleConfirmDelete = async (rollNo) => {
    setIsDeleting(true);
    try {
      await deleteStudent(rollNo);
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      if (highlightRollNo === rollNo) setHighlightRollNo(null);
      showToast(`Student #${rollNo} deleted from BST and tree restructured!`, 'success');
      await loadData(true);
    } catch (err) {
      showToast(`Failed to delete student: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Node selection from tree, search, or table
  const handleSelectStudent = (student) => {
    if (!student) return;
    setHighlightRollNo(student.rollNo);
    setActiveTab('tree');
    // Smooth scroll to visualizer
    if (visualizerSectionRef.current) {
      visualizerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast(`Focused on Roll #${student.rollNo} (${student.name}) in BST.`, 'info', 2500);
  };

  return (
    <div className="app-layout">
      {/* 1. Navigation Bar */}
      <Navbar
        backendStatus={backendStatus}
        isPreviewMode={isPreviewMode}
        onTogglePreviewMode={handleTogglePreviewMode}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenTheoryModal={() => setIsTheoryModalOpen(true)}
        onRefresh={() => loadData(false)}
        isRefreshing={isRefreshing}
      />

      <main className="main-content-container">
        {/* Disconnected Alert Banner (Shown when backend is down and preview mode is OFF) */}
        {backendStatus === 'offline' && !isPreviewMode && (
          <div className="disconnected-alert-banner glass-panel animate-fade-in">
            <div className="alert-content">
              <div className="alert-icon-wrap">
                <AlertCircleIcon size={24} className="text-danger" />
              </div>
              <div className="alert-text-block">
                <h4 className="alert-title">C++ Backend Server Not Reachable</h4>
                <p className="alert-desc">
                  The frontend is unable to establish an HTTP connection with your C++ BST backend at{' '}
                  <code className="font-mono text-cyan">{getApiBaseUrl() || '(no URL configured)'}</code>.
                  BST operations must be executed by your C++ backend.
                </p>
              </div>
            </div>
            <div className="alert-actions">
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => handleTogglePreviewMode(true)}
              >
                <SparklesIcon size={14} />
                <span>Turn On Demo Mode</span>
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setIsSettingsModalOpen(true)}
              >
                <SettingsIcon size={14} />
                <span>Configure URL</span>
              </button>
            </div>
          </div>
        )}

        {/* Demo Mode Notice Banner (Shown when preview mode is active) */}
        {isPreviewMode && (
          <div className="preview-mode-banner animate-fade-in">
            <div className="banner-left">
              <span className="badge badge-warning">DEMO MODE ACTIVE</span>
              <p className="text-xs">
                Simulating C++ BST logic locally. In production, connect this frontend to your C++ HTTP server.
              </p>
            </div>
            <button
              type="button"
              className="btn-link text-xs"
              onClick={() => handleTogglePreviewMode(false)}
            >
              Disable Demo Mode &rarr;
            </button>
          </div>
        )}

        {/* Hero & Quick Search */}
        <section className="hero-search-section">
          <div className="hero-heading-block">
            <h2 className="hero-title">Student Ranking System</h2>
            <p className="hero-subtitle">
              Interactive Binary Search Tree visualizer and real-time class merit standings.
            </p>
          </div>

          <SearchBar
            onSelectStudent={handleSelectStudent}
            onDeleteRequest={handleDeleteRequest}
            onShowToast={showToast}
          />
        </section>

        {/* 2. Stat Cards Grid */}
        <section className="stats-section">
          <StatCards stats={stats} isPreview={isPreviewMode} />
        </section>

        {/* 3. Tab Navigation */}
        <section className="tabs-navigation-section">
          <div className="tab-pill-container glass-panel">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'tree' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('tree')}
            >
              <TreeIcon size={16} />
              <span>BST Visualizer</span>
              {treeData?.totalNodes > 0 && (
                <span className="tab-count-badge font-mono">{treeData.totalNodes}</span>
              )}
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'table' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('table')}
            >
              <UsersIcon size={16} />
              <span>Student Directory</span>
              <span className="tab-count-badge font-mono">{students.length}</span>
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === 'leaderboard' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              <TrophyIcon size={16} />
              <span>Leaderboard &bull; Honor Roll</span>
            </button>
          </div>
        </section>

        {/* Tab Content Display */}
        <section className="tab-content-area" ref={visualizerSectionRef}>
          {isLoading && !isRefreshing ? (
            <div className="global-loader-box glass-panel">
              <span className="global-spinner"></span>
              <p>Connecting to C++ BST Backend...</p>
            </div>
          ) : (
            <>
              {activeTab === 'tree' && (
                <BSTVisualizer
                  treeData={treeData}
                  highlightRollNo={highlightRollNo}
                  onSelectStudent={handleSelectStudent}
                  onDeleteRequest={handleDeleteRequest}
                  onRefresh={() => loadData(false)}
                  isRefreshing={isRefreshing}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                />
              )}

              {activeTab === 'table' && (
                <StudentTable
                  students={students}
                  onSelectStudent={handleSelectStudent}
                  onDeleteRequest={handleDeleteRequest}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                />
              )}

              {activeTab === 'leaderboard' && (
                <Leaderboard
                  leaderboard={leaderboard}
                  onSelectStudent={handleSelectStudent}
                  onDeleteRequest={handleDeleteRequest}
                />
              )}
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <TreeIcon size={18} className="text-cyan" />
            <span>Student Ranking System Using BST &bull; College Data Structures Project</span>
          </div>
          <div className="footer-right">
            <button 
              type="button" 
              className="btn-link text-xs" 
              onClick={() => setIsTheoryModalOpen(true)}
            >
              BST Time Complexity O(log N)
            </button>
            <span className="footer-divider">&bull;</span>
            <button 
              type="button" 
              className="btn-link text-xs" 
              onClick={() => setIsSettingsModalOpen(true)}
            >
              Backend API Endpoints
            </button>
            <span className="footer-divider">&bull;</span>
            <a 
              href="/Student_Ranking_System_BST_Backend_Code.pdf"
              download="Student_Ranking_System_BST_Backend_Code.pdf"
              className="btn-link text-xs"
              target="_blank"
              rel="noopener noreferrer"
            >
              C++ Backend Code (PDF)
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStudent={handleAddStudent}
        existingStudents={students}
        isSubmitting={isSubmitting}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        student={studentToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <ApiSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        backendStatus={backendStatus}
        isPreviewMode={isPreviewMode}
        onTogglePreviewMode={handleTogglePreviewMode}
        onCheckHealth={checkBackendHealth}
        onShowToast={showToast}
      />

      <BSTTheoryModal
        isOpen={isTheoryModalOpen}
        onClose={() => setIsTheoryModalOpen(false)}
      />

      {/* Toast Notifications */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
