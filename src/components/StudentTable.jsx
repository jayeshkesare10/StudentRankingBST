import React, { useState, useMemo } from 'react';
import { SearchIcon, TrashIcon, TreeIcon, UsersIcon } from './Icons';

export default function StudentTable({ 
  students, 
  onSelectStudent, 
  onDeleteRequest, 
  onOpenAddModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [sortField, setSortField] = useState('rank'); // 'rank', 'rollNo', 'name', 'marks'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    if (!students) return [];

    let result = [...students];

    // Search query filter (roll or name)
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(
        s => s.rollNo.toString().includes(q) || s.name.toLowerCase().includes(q)
      );
    }

    // Tier filter
    if (tierFilter === 'DISTINCTION') {
      result = result.filter(s => s.marks >= 75);
    } else if (tierFilter === 'FIRST_CLASS') {
      result = result.filter(s => s.marks >= 60 && s.marks < 75);
    } else if (tierFilter === 'PASS') {
      result = result.filter(s => s.marks >= 40 && s.marks < 60);
    } else if (tierFilter === 'AT_RISK') {
      result = result.filter(s => s.marks < 40);
    }

    // Sorting
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        const cmp = valA.localeCompare(valB);
        return sortDirection === 'asc' ? cmp : -cmp;
      }

      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [students, searchTerm, tierFilter, sortField, sortDirection]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'marks' ? 'desc' : 'asc');
    }
  };

  const getTierBadge = (marks) => {
    if (marks >= 75) return <span className="badge badge-success">Distinction</span>;
    if (marks >= 60) return <span className="badge badge-primary">First Class</span>;
    if (marks >= 40) return <span className="badge badge-warning">Pass</span>;
    return <span className="badge badge-danger">At Risk</span>;
  };

  return (
    <div className="student-table-card glass-panel">
      {/* Table Controls */}
      <div className="table-controls-header">
        <div className="table-search-box">
          <SearchIcon size={16} className="table-search-icon" />
          <input
            type="text"
            placeholder="Filter table by Roll No or Name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <button 
              type="button" 
              className="clear-search-btn" 
              onClick={() => setSearchTerm('')}
            >
              &times;
            </button>
          )}
        </div>

        {/* Tier Filter Pills */}
        <div className="tier-filter-pills">
          <button
            type="button"
            className={`tier-pill ${tierFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => { setTierFilter('ALL'); setCurrentPage(1); }}
          >
            All ({students?.length || 0})
          </button>
          <button
            type="button"
            className={`tier-pill ${tierFilter === 'DISTINCTION' ? 'active' : ''}`}
            onClick={() => { setTierFilter('DISTINCTION'); setCurrentPage(1); }}
          >
            &ge;75%
          </button>
          <button
            type="button"
            className={`tier-pill ${tierFilter === 'FIRST_CLASS' ? 'active' : ''}`}
            onClick={() => { setTierFilter('FIRST_CLASS'); setCurrentPage(1); }}
          >
            60-74%
          </button>
          <button
            type="button"
            className={`tier-pill ${tierFilter === 'PASS' ? 'active' : ''}`}
            onClick={() => { setTierFilter('PASS'); setCurrentPage(1); }}
          >
            40-59%
          </button>
          <button
            type="button"
            className={`tier-pill ${tierFilter === 'AT_RISK' ? 'active' : ''}`}
            onClick={() => { setTierFilter('AT_RISK'); setCurrentPage(1); }}
          >
            &lt;40%
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-responsive-wrapper">
        <table className="student-records-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('rank')} className="sortable-th">
                Rank {sortField === 'rank' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('rollNo')} className="sortable-th">
                Roll Number {sortField === 'rollNo' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('name')} className="sortable-th">
                Student Name {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('marks')} className="sortable-th">
                Marks (0-100) {sortField === 'marks' && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
              <th>Grade Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty-row">
                  <div className="table-empty-state">
                    <UsersIcon size={32} />
                    <p>No student records match your query.</p>
                    {students?.length === 0 && (
                      <button 
                        type="button" 
                        className="btn-primary btn-sm"
                        onClick={onOpenAddModal}
                      >
                        Enroll Student
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedStudents.map(student => {
                const isTopper = student.rank === 1;

                return (
                  <tr key={student.rollNo} className="student-table-row">
                    <td>
                      <span className={`table-rank-badge font-mono ${isTopper ? 'table-rank-gold' : ''}`}>
                        {isTopper ? '★ 1' : `#${student.rank || '—'}`}
                      </span>
                    </td>
                    <td className="font-mono table-roll-cell">
                      #{student.rollNo}
                    </td>
                    <td className="table-name-cell">
                      <strong>{student.name}</strong>
                    </td>
                    <td className="font-mono table-marks-cell">
                      <div className="marks-cell-wrap">
                        <span className="marks-num">{student.marks}</span>
                        <div className="marks-mini-bar">
                          <div 
                            className="marks-mini-fill" 
                            style={{ width: `${Math.min(100, student.marks)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {getTierBadge(student.marks)}
                    </td>
                    <td className="text-right table-actions-cell">
                      <button
                        type="button"
                        className="btn-icon-sm action-btn-tree"
                        onClick={() => onSelectStudent && onSelectStudent(student)}
                        title="Locate in BST Visualizer"
                      >
                        <TreeIcon size={14} />
                        <span className="hide-on-mobile">BST</span>
                      </button>

                      <button
                        type="button"
                        className="btn-icon-sm action-btn-delete"
                        onClick={() => onDeleteRequest && onDeleteRequest(student)}
                        title="Delete from BST"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredStudents.length > pageSize && (
        <div className="table-pagination-footer">
          <span className="pagination-info text-muted text-xs">
            Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredStudents.length)} of {filteredStudents.length} records
          </span>
          <div className="pagination-buttons">
            <button
              type="button"
              className="btn-secondary btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              &larr; Prev
            </button>
            <span className="pagination-current font-mono">
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              className="btn-secondary btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
