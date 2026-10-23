import React from 'react';
import { UsersIcon, PercentIcon, TrophyIcon, TreeIcon } from './Icons';

export default function StatCards({ stats, isPreview }) {
  const total = stats?.totalStudents ?? 0;
  const avg = stats?.averageMarks ?? 0;
  const topper = stats?.topper ?? null;
  const treeHeight = stats?.treeHeight ?? (total > 0 ? Math.ceil(Math.log2(total + 1)) : 0);

  // Score tier
  let avgTier = 'N/A';
  let avgBadgeClass = 'badge-primary';
  if (total > 0) {
    if (avg >= 75) {
      avgTier = 'Distinction Class';
      avgBadgeClass = 'badge-success';
    } else if (avg >= 60) {
      avgTier = 'First Class';
      avgBadgeClass = 'badge-primary';
    } else if (avg >= 40) {
      avgTier = 'Pass Class';
      avgBadgeClass = 'badge-warning';
    } else {
      avgTier = 'Needs Attention';
      avgBadgeClass = 'badge-danger';
    }
  }

  return (
    <div className="stat-cards-grid">
      {/* 1. Total Students */}
      <div className="stat-card glass-panel">
        <div className="stat-card-header">
          <span className="stat-card-label">Total Enrolled</span>
          <div className="stat-card-icon-wrap icon-blue">
            <UsersIcon size={20} />
          </div>
        </div>
        <div className="stat-card-body">
          <div className="stat-card-value font-mono">{total}</div>
          <div className="stat-card-sub">
            <span className="badge badge-primary">BST Nodes: {total}</span>
            {isPreview && <span className="stat-preview-tag">Demo</span>}
          </div>
        </div>
      </div>

      {/* 2. Average Marks */}
      <div className="stat-card glass-panel">
        <div className="stat-card-header">
          <span className="stat-card-label">Class Average</span>
          <div className="stat-card-icon-wrap icon-cyan">
            <PercentIcon size={20} />
          </div>
        </div>
        <div className="stat-card-body">
          <div className="stat-card-value font-mono">
            {total > 0 ? `${avg}%` : '0%'}
          </div>
          <div className="stat-card-sub">
            <span className={`badge ${avgBadgeClass}`}>{avgTier}</span>
          </div>
        </div>
      </div>

      {/* 3. Class Topper */}
      <div className="stat-card glass-panel stat-card-topper">
        <div className="stat-card-header">
          <span className="stat-card-label">Class Topper (Rank 1)</span>
          <div className="stat-card-icon-wrap icon-gold">
            <TrophyIcon size={20} />
          </div>
        </div>
        <div className="stat-card-body">
          {topper ? (
            <>
              <div className="topper-name-row">
                <span className="topper-name">{topper.name}</span>
                <span className="topper-marks font-mono">{topper.marks} / 100</span>
              </div>
              <div className="stat-card-sub">
                <span className="badge badge-warning">Roll #{topper.rollNo}</span>
                <span className="topper-percentile">Max BST Value</span>
              </div>
            </>
          ) : (
            <>
              <div className="stat-card-value text-muted font-mono">—</div>
              <div className="stat-card-sub">
                <span className="text-dim">No records enrolled yet</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. BST Tree Depth */}
      <div className="stat-card glass-panel">
        <div className="stat-card-header">
          <span className="stat-card-label">BST Height (Levels)</span>
          <div className="stat-card-icon-wrap icon-tree">
            <TreeIcon size={20} />
          </div>
        </div>
        <div className="stat-card-body">
          <div className="stat-card-value font-mono">
            {treeHeight} <span className="stat-unit">levels</span>
          </div>
          <div className="stat-card-sub">
            <span className="badge badge-primary font-mono">O(log N) Search</span>
            <span className="text-dim text-xs">Max Comparisons: {treeHeight || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
