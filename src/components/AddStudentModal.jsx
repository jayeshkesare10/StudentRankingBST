import React, { useState, useEffect } from 'react';
import { CloseIcon, PlusIcon, TreeIcon } from './Icons';

export default function AddStudentModal({ 
  isOpen, 
  onClose, 
  onAddStudent, 
  existingStudents = [], 
  isSubmitting 
}) {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [marks, setMarks] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setName('');
      setRollNo('');
      setMarks('');
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    // Validate Name
    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Student name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      newErrors.name = 'Name must only contain alphabetic letters and spaces.';
    }

    // Validate Roll Number
    const parsedRoll = parseInt(rollNo, 10);
    if (!rollNo || isNaN(parsedRoll)) {
      newErrors.rollNo = 'Valid numeric roll number is required.';
    } else if (parsedRoll <= 0) {
      newErrors.rollNo = 'Roll number must be a positive integer greater than 0.';
    } else if (existingStudents.some(s => Number(s.rollNo) === parsedRoll)) {
      newErrors.rollNo = `Roll number #${parsedRoll} already exists in the BST.`;
    }

    // Validate Marks
    const parsedMarks = parseFloat(marks);
    if (marks === '' || isNaN(parsedMarks)) {
      newErrors.marks = 'Marks are required.';
    } else if (parsedMarks < 0 || parsedMarks > 100) {
      newErrors.marks = 'Marks must be between 0 and 100.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAddStudent({
      name: name.trim(),
      rollNo: parseInt(rollNo, 10),
      marks: parseFloat(marks)
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <PlusIcon size={20} />
            </div>
            <div>
              <h3 className="modal-title">Insert Student into BST</h3>
              <p className="modal-subtitle">New node will be positioned according to marks</p>
            </div>
          </div>
          <button type="button" className="btn-icon-sm" onClick={onClose} disabled={isSubmitting}>
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Roll Number Field */}
          <div className="form-group">
            <label htmlFor="student-roll" className="form-label">
              Roll Number <span className="text-danger">*</span>
            </label>
            <input
              id="student-roll"
              type="number"
              placeholder="e.g. 101"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className={errors.rollNo ? 'input-error' : ''}
              min="1"
              autoFocus
              disabled={isSubmitting}
            />
            {errors.rollNo ? (
              <span className="field-error-msg">{errors.rollNo}</span>
            ) : (
              <span className="field-hint">Unique identifier for student record</span>
            )}
          </div>

          {/* Student Name Field */}
          <div className="form-group">
            <label htmlFor="student-name" className="form-label">
              Student Full Name <span className="text-danger">*</span>
            </label>
            <input
              id="student-name"
              type="text"
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'input-error' : ''}
              maxLength="60"
              disabled={isSubmitting}
            />
            {errors.name && <span className="field-error-msg">{errors.name}</span>}
          </div>

          {/* Marks Field */}
          <div className="form-group">
            <label htmlFor="student-marks" className="form-label">
              Total Marks (0 – 100) <span className="text-danger">*</span>
            </label>
            <input
              id="student-marks"
              type="number"
              step="any"
              placeholder="e.g. 88.5"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className={errors.marks ? 'input-error' : ''}
              min="0"
              max="100"
              disabled={isSubmitting}
            />
            {errors.marks ? (
              <span className="field-error-msg">{errors.marks}</span>
            ) : (
              <span className="field-hint">BST ordering key used to determine rank</span>
            )}
          </div>

          {/* BST Placement Note */}
          <div className="form-bst-note">
            <TreeIcon size={16} className="text-cyan" />
            <span>
              C++ backend will insert this node into the BST in <code>O(log N)</code> average time.
            </span>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Inserting into BST...</span>
                </>
              ) : (
                <>
                  <PlusIcon size={16} />
                  <span>Insert Node</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
