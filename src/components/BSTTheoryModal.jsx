import React from 'react';
import { CloseIcon, BookOpenIcon, TreeIcon } from './Icons';

export default function BSTTheoryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-dialog-lg glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <BookOpenIcon size={20} />
            </div>
            <div>
              <h3 className="modal-title">Binary Search Tree (BST) Architecture &amp; Theory</h3>
              <p className="modal-subtitle">Data Structures Project Reference Guide</p>
            </div>
          </div>
          <button type="button" className="btn-icon-sm" onClick={onClose}>
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body theory-content">
          {/* Section 1: Introduction */}
          <div className="theory-section">
            <h4 className="theory-heading">
              <TreeIcon size={18} className="text-cyan" />
              1. What is a Binary Search Tree (BST)?
            </h4>
            <p>
              A <strong>Binary Search Tree (BST)</strong> is a node-based binary tree data structure where each node contains a key (in our system, <em>Student Marks</em> or <em>Roll Number</em>), a student data payload, and two pointer references to subtrees: <code>left</code> and <code>right</code>.
            </p>
            <div className="theory-highlight-box">
              <strong>Core Invariant Rule:</strong>
              <ul>
                <li>The <strong>Left Subtree</strong> of a node contains only keys <em>strictly less than</em> the node&apos;s key.</li>
                <li>The <strong>Right Subtree</strong> of a node contains only keys <em>greater than or equal to</em> the node&apos;s key.</li>
                <li>Both left and right subtrees must also be binary search trees.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: How Ranking Works */}
          <div className="theory-section">
            <h4 className="theory-heading">
              2. Ranking via In-Order Traversal
            </h4>
            <p>
              Standard arrays require an explicit sorting algorithm such as Quicksort (<code>O(N log N)</code>) to generate rankings. In contrast, a BST allows ranking generation directly via tree traversal:
            </p>
            <div className="theory-code-box font-mono text-xs">
              <div className="code-comment">// C++ Reverse In-Order Traversal for Descending Ranking</div>
              <div>void getLeaderboard(Node* root, vector&lt;Student&gt;&amp; list) &#123;</div>
              <div>&nbsp;&nbsp;if (root == nullptr) return;</div>
              <div>&nbsp;&nbsp;getLeaderboard(root-&gt;right, list); <span className="code-comment">// 1. Visit higher marks first</span></div>
              <div>&nbsp;&nbsp;list.push_back(root-&gt;student);&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-comment">// 2. Process current node</span></div>
              <div>&nbsp;&nbsp;getLeaderboard(root-&gt;left, list);&nbsp;&nbsp;<span className="code-comment">// 3. Visit lower marks last</span></div>
              <div>&#125;</div>
            </div>
            <p className="text-sm">
              This traversal visits every node exactly once in <strong>O(N)</strong> time, yielding a strictly descending leaderboard sorted by marks without requiring an auxiliary sort routine.
            </p>
          </div>

          {/* Section 3: Time and Space Complexity */}
          <div className="theory-section">
            <h4 className="theory-heading">
              3. Time &amp; Space Complexity Analysis
            </h4>
            <div className="theory-table-wrap">
              <table className="theory-table">
                <thead>
                  <tr>
                    <th>Operation</th>
                    <th>Average Case</th>
                    <th>Worst Case (Skewed)</th>
                    <th>Best Case</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Search Student</strong></td>
                    <td className="font-mono text-success">O(log N)</td>
                    <td className="font-mono text-danger">O(N)</td>
                    <td className="font-mono text-cyan">O(1) (at root)</td>
                  </tr>
                  <tr>
                    <td><strong>Insert Student</strong></td>
                    <td className="font-mono text-success">O(log N)</td>
                    <td className="font-mono text-danger">O(N)</td>
                    <td className="font-mono text-cyan">O(1)</td>
                  </tr>
                  <tr>
                    <td><strong>Delete Student</strong></td>
                    <td className="font-mono text-success">O(log N)</td>
                    <td className="font-mono text-danger">O(N)</td>
                    <td className="font-mono text-cyan">O(1)</td>
                  </tr>
                  <tr>
                    <td><strong>Leaderboard Traversal</strong></td>
                    <td className="font-mono text-primary">O(N)</td>
                    <td className="font-mono text-primary">O(N)</td>
                    <td className="font-mono text-primary">O(N)</td>
                  </tr>
                  <tr>
                    <td><strong>Auxiliary Space</strong></td>
                    <td className="font-mono text-primary">O(H) recursion stack</td>
                    <td className="font-mono text-danger">O(N)</td>
                    <td className="font-mono text-cyan">O(log N)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="theory-footnote text-xs text-muted">
              * Where <code>N</code> is the number of student records and <code>H</code> is the tree height. In a balanced tree, <code>H = ceil(log2(N + 1))</code>.
            </p>
          </div>

          {/* Section 4: Deletion Cases */}
          <div className="theory-section">
            <h4 className="theory-heading">
              4. C++ BST Deletion Mechanics
            </h4>
            <div className="cases-grid">
              <div className="case-card">
                <span className="case-pill">Case 1: Leaf Node</span>
                <p className="text-xs">
                  Node has no children. It is simply deallocated using <code>delete node;</code> and its parent pointer is set to <code>nullptr</code>.
                </p>
              </div>
              <div className="case-card">
                <span className="case-pill">Case 2: One Child</span>
                <p className="text-xs">
                  Node has either only left or only right child. The single child links directly to the parent, bypassing the removed node.
                </p>
              </div>
              <div className="case-card">
                <span className="case-pill">Case 3: Two Children</span>
                <p className="text-xs">
                  Replaced by its <strong>In-order Successor</strong> (the minimum node in its right subtree), preserving the BST ordering property.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
