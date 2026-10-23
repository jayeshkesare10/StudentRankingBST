import React from 'react';
import { CloseIcon, TrashIcon, AlertCircleIcon, TreeIcon } from './Icons';

export default function DeleteModal({ 
  student, 
  isOpen, 
  onClose, 
  onConfirmDelete, 
  isDeleting 
}) {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-dialog modal-dialog-danger glass-panel animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge badge-danger-icon">
              <TrashIcon size={20} />
            </div>
            <div>
              <h3 className="modal-title text-danger">Confirm BST Node Deletion</h3>
              <p className="modal-subtitle">This action permanently deletes this node from the tree</p>
            </div>
          </div>
          <button type="button" className="btn-icon-sm" onClick={onClose} disabled={isDeleting}>
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          <div className="delete-student-card">
            <div className="delete-card-row">
              <span className="text-muted text-xs">Roll Number:</span>
              <strong className="font-mono text-cyan">#{student.rollNo}</strong>
            </div>
            <div className="delete-card-row">
              <span className="text-muted text-xs">Student Name:</span>
              <strong>{student.name}</strong>
            </div>
            <div className="delete-card-row">
              <span className="text-muted text-xs">Marks:</span>
              <span className="font-mono">{student.marks} / 100</span>
            </div>
            <div className="delete-card-row">
              <span className="text-muted text-xs">Current Rank:</span>
              <span className="badge badge-primary font-mono">Rank #{student.rank || '—'}</span>
            </div>
          </div>

          <div className="delete-bst-explanation">
            <div className="explanation-title-row">
              <TreeIcon size={16} className="text-warning" />
              <strong>BST Deletion Mechanics in C++:</strong>
            </div>
            <ul className="deletion-rules-list">
              <li>
                <strong>Case 1 (Leaf Node):</strong> Removed directly from memory; parent's pointer set to <code>nullptr</code>.
              </li>
              <li>
                <strong>Case 2 (1 Child):</strong> The child node links directly to the parent, bypassing the removed node.
              </li>
              <li>
                <strong>Case 3 (2 Children):</strong> The C++ backend replaces this node with its <em>In-order Successor</em> (smallest key in the right subtree) and recursively deletes the duplicate.
              </li>
            </ul>
          </div>

          <p className="delete-warning-text">
            <AlertCircleIcon size={16} />
            <span>Are you sure you want to remove <strong>{student.name}</strong> from the Binary Search Tree?</span>
          </p>
        </div>

        {/* Actions */}
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onClose} 
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn-danger" 
            onClick={() => onConfirmDelete(student.rollNo)} 
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="btn-spinner"></span>
                <span>Deleting Node...</span>
              </>
            ) : (
              <>
                <TrashIcon size={16} />
                <span>Yes, Delete from BST</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
