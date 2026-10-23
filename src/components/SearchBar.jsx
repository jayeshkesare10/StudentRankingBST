import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, CloseIcon, TreeIcon, TrashIcon } from './Icons';
import { searchStudent } from '../services/api';

export default function SearchBar({ 
  onSelectStudent, 
  onDeleteRequest, 
  onShowToast 
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const { results: matchedResults } = await searchStudent(query.trim());
      setResults(matchedResults || []);
      setIsOpen(true);
      if ((!matchedResults || matchedResults.length === 0) && onShowToast) {
        onShowToast(`No student found matching "${query.trim()}" in BST.`, 'info');
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast(`Search failed: ${err.message}`, 'error');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setHasSearched(false);
  };

  return (
    <div className="search-bar-wrapper" ref={containerRef}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <SearchIcon size={18} className="search-icon-adornment" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Roll Number or Student Name (BST Query)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value) {
                setIsOpen(false);
                setHasSearched(false);
              }
            }}
            onFocus={() => {
              if (results.length > 0 && query.trim()) setIsOpen(true);
            }}
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              title="Clear Search"
            >
              <CloseIcon size={14} />
            </button>
          )}
          <button
            type="submit"
            className="search-submit-btn"
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? <span className="btn-spinner-sm"></span> : 'Search'}
          </button>
        </div>
      </form>

      {/* Search Results Dropdown Card */}
      {isOpen && (
        <div className="search-results-dropdown glass-panel animate-fade-in">
          <div className="search-results-header">
            <span className="results-count-text">
              {results.length > 0 ? `Found ${results.length} Match(es) in BST` : 'No Records Found'}
            </span>
            <button type="button" className="btn-link text-xs" onClick={() => setIsOpen(false)}>
              Close
            </button>
          </div>

          {results.length === 0 ? (
            <div className="search-no-results">
              <p>No student with Roll No or Name matching &ldquo;{query}&rdquo; exists in the BST.</p>
            </div>
          ) : (
            <div className="search-results-list">
              {results.map((student) => (
                <div key={student.rollNo} className="search-result-item">
                  <div className="result-main-info">
                    <span className="result-roll font-mono">#{student.rollNo}</span>
                    <strong className="result-name">{student.name}</strong>
                    <span className="result-marks font-mono">{student.marks} marks</span>
                    <span className="badge badge-primary font-mono">Rank #{student.rank}</span>
                  </div>

                  <div className="result-item-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        if (onSelectStudent) onSelectStudent(student);
                        setIsOpen(false);
                      }}
                      title="Focus on this node in BST visualizer"
                    >
                      <TreeIcon size={14} />
                      <span>Locate in Tree</span>
                    </button>

                    <button
                      type="button"
                      className="btn-danger btn-sm"
                      onClick={() => {
                        if (onDeleteRequest) onDeleteRequest(student);
                        setIsOpen(false);
                      }}
                      title="Delete this student"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
