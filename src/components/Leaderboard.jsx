import React from 'react';
import { TrophyIcon, SparklesIcon, TreeIcon } from './Icons';

export default function Leaderboard({ 
  leaderboard, 
  onSelectStudent, 
  onDeleteRequest 
}) {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="leaderboard-empty glass-panel">
        <div className="empty-icon-wrap">
          <TrophyIcon size={40} />
        </div>
        <h4>No Ranked Records Available</h4>
        <p>Add students to the BST to automatically compute class rankings.</p>
      </div>
    );
  }

  // Top 3 Podium
  const top1 = leaderboard[0] || null;
  const top2 = leaderboard[1] || null;
  const top3 = leaderboard[2] || null;
  const remaining = leaderboard.slice(3);

  return (
    <div className="leaderboard-container">
      {/* Podium Section */}
      <div className="podium-card glass-panel">
        <div className="podium-header">
          <div className="podium-title-wrap">
            <div className="podium-icon-badge">
              <TrophyIcon size={22} />
            </div>
            <div>
              <h3 className="podium-title">Honor Roll &bull; Class Podium</h3>
              <p className="podium-desc">Top performers determined via BST Reverse In-Order Traversal</p>
            </div>
          </div>
          <span className="badge badge-warning">
            <SparklesIcon size={12} /> Top 3 Ranked
          </span>
        </div>

        <div className="podium-display">
          {/* 2nd Place */}
          <div className="podium-column podium-silver">
            {top2 ? (
              <div className="podium-card-inner" onClick={() => onSelectStudent(top2)}>
                <div className="podium-medal silver-medal">2</div>
                <div className="podium-avatar silver-avatar">
                  {top2.name.charAt(0)}
                </div>
                <h4 className="podium-student-name" title={top2.name}>{top2.name}</h4>
                <div className="podium-student-marks font-mono">{top2.marks} pts</div>
                <span className="podium-roll font-mono">Roll #{top2.rollNo}</span>
                <div className="podium-pedestal pedestal-2">
                  <span>2ND PLACE</span>
                </div>
              </div>
            ) : (
              <div className="podium-placeholder">Empty</div>
            )}
          </div>

          {/* 1st Place (Center & Highest) */}
          <div className="podium-column podium-gold">
            {top1 ? (
              <div className="podium-card-inner" onClick={() => onSelectStudent(top1)}>
                <div className="podium-crown">👑</div>
                <div className="podium-medal gold-medal">1</div>
                <div className="podium-avatar gold-avatar">
                  {top1.name.charAt(0)}
                </div>
                <h4 className="podium-student-name" title={top1.name}>{top1.name}</h4>
                <div className="podium-student-marks font-mono gold-marks">{top1.marks} pts</div>
                <span className="podium-roll font-mono">Roll #{top1.rollNo}</span>
                <div className="podium-pedestal pedestal-1">
                  <span>CLASS TOPPER</span>
                </div>
              </div>
            ) : (
              <div className="podium-placeholder">Empty</div>
            )}
          </div>

          {/* 3rd Place */}
          <div className="podium-column podium-bronze">
            {top3 ? (
              <div className="podium-card-inner" onClick={() => onSelectStudent(top3)}>
                <div className="podium-medal bronze-medal">3</div>
                <div className="podium-avatar bronze-avatar">
                  {top3.name.charAt(0)}
                </div>
                <h4 className="podium-student-name" title={top3.name}>{top3.name}</h4>
                <div className="podium-student-marks font-mono">{top3.marks} pts</div>
                <span className="podium-roll font-mono">Roll #{top3.rollNo}</span>
                <div className="podium-pedestal pedestal-3">
                  <span>3RD PLACE</span>
                </div>
              </div>
            ) : (
              <div className="podium-placeholder">Empty</div>
            )}
          </div>
        </div>
      </div>

      {/* Traversal Info Banner */}
      <div className="traversal-info-banner glass-panel">
        <TreeIcon size={20} className="text-cyan" />
        <div className="traversal-info-text">
          <strong>BST Inorder Traversal Property:</strong>
          <span>
            {" "}In a Binary Search Tree keyed by marks, performing a Reverse In-Order Traversal (Right &rarr; Root &rarr; Left) naturally outputs all nodes in strictly descending order with <strong>O(N)</strong> linear time complexity.
          </span>
        </div>
      </div>

      {/* Full Ranking List */}
      <div className="rankings-table-card glass-panel">
        <div className="rankings-header">
          <h4 className="rankings-table-title">Complete Class Standings ({leaderboard.length})</h4>
          <span className="text-muted text-xs">Sorted from highest to lowest marks</span>
        </div>

        <div className="rankings-list">
          {leaderboard.map((student, idx) => {
            const rank = student.rank || (idx + 1);
            const isTop3 = rank <= 3;
            let rankBadgeClass = 'rank-badge-normal';
            if (rank === 1) rankBadgeClass = 'rank-badge-gold';
            else if (rank === 2) rankBadgeClass = 'rank-badge-silver';
            else if (rank === 3) rankBadgeClass = 'rank-badge-bronze';

            return (
              <div 
                key={student.rollNo} 
                className={`ranking-row ${isTop3 ? 'ranking-row-top' : ''}`}
                onClick={() => onSelectStudent && onSelectStudent(student)}
              >
                <div className="ranking-col-rank">
                  <span className={`rank-badge ${rankBadgeClass} font-mono`}>
                    #{rank}
                  </span>
                </div>

                <div className="ranking-col-info">
                  <div className="ranking-name-row">
                    <span className="ranking-name">{student.name}</span>
                    <span className="ranking-roll font-mono">Roll #{student.rollNo}</span>
                  </div>
                  <div className="ranking-progress-bar-wrap">
                    <div 
                      className="ranking-progress-bar" 
                      style={{ width: `${Math.min(100, student.marks)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="ranking-col-marks font-mono">
                  <span className="ranking-marks-val">{student.marks}</span>
                  <span className="ranking-marks-max">/100</span>
                </div>

                <div className="ranking-col-actions">
                  <button
                    type="button"
                    className="btn-link text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectStudent) onSelectStudent(student);
                    }}
                  >
                    View in BST &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
