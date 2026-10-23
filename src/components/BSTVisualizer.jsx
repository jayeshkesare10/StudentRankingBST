import React, { useState, useMemo, useRef } from 'react';
import { 
  TreeIcon, 
  RefreshIcon, 
  ZoomInIcon, 
  ZoomOutIcon, 
  MaximizeIcon, 
  CloseIcon, 
  TrashIcon, 
  TrophyIcon 
} from './Icons';

/**
 * Calculates (x, y) coordinates for all nodes in the binary tree
 */
function layoutTree(root) {
  if (!root) return { nodes: [], edges: [], width: 800, height: 400 };

  const nodes = [];
  const edges = [];

  // Determine tree depth
  function getDepth(node) {
    if (!node) return 0;
    return 1 + Math.max(getDepth(node.left), getDepth(node.right));
  }

  const depth = getDepth(root);
  const verticalSpacing = 95;
  const initialHorizontalSpacing = Math.max(70, Math.pow(2, depth - 1) * 36);

  function assignPositions(node, x, y, level, hSpacing, parent = null, branchType = null) {
    if (!node) return;

    const currentId = `node-${node.rollNo}`;
    const nodeObj = {
      id: currentId,
      rollNo: node.rollNo,
      name: node.name,
      marks: node.marks,
      rank: node.rank,
      x,
      y,
      level,
      isRoot: level === 0,
      hasLeft: !!node.left,
      hasRight: !!node.right
    };

    nodes.push(nodeObj);

    if (parent) {
      edges.push({
        id: `edge-${parent.rollNo}-${node.rollNo}`,
        from: { x: parent.x, y: parent.y + 26 },
        to: { x, y: y - 26 },
        branchType, // 'left' or 'right'
        parentRollNo: parent.rollNo,
        childRollNo: node.rollNo
      });
    }

    const nextHSpacing = hSpacing / 2;

    if (node.left) {
      assignPositions(
        node.left, 
        x - nextHSpacing, 
        y + verticalSpacing, 
        level + 1, 
        nextHSpacing, 
        nodeObj, 
        'left'
      );
    }

    if (node.right) {
      assignPositions(
        node.right, 
        x + nextHSpacing, 
        y + verticalSpacing, 
        level + 1, 
        nextHSpacing, 
        nodeObj, 
        'right'
      );
    }
  }

  // Assign starting position
  const startX = Math.max(500, initialHorizontalSpacing * 2 + 100);
  assignPositions(root, startX, 60, 0, initialHorizontalSpacing);

  // Compute bounding box
  const minX = Math.min(...nodes.map(n => n.x)) - 80;
  const maxX = Math.max(...nodes.map(n => n.x)) + 80;
  const maxY = Math.max(...nodes.map(n => n.y)) + 80;

  // Normalize so minX starts at 60
  const offsetX = minX < 60 ? 60 - minX : 0;
  nodes.forEach(n => { n.x += offsetX; });
  edges.forEach(e => {
    e.from.x += offsetX;
    e.to.x += offsetX;
  });

  const totalWidth = Math.max(900, maxX + offsetX + 100);
  const totalHeight = Math.max(480, maxY + 60);

  return { nodes, edges, width: totalWidth, height: totalHeight };
}

export default function BSTVisualizer({ 
  treeData, 
  highlightRollNo, 
  onSelectStudent, 
  onDeleteRequest, 
  onRefresh, 
  isRefreshing, 
  onOpenAddModal 
}) {
  const [scale, setScale] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const containerRef = useRef(null);

  const root = treeData?.root || null;
  const totalNodes = treeData?.totalNodes ?? 0;
  const treeHeight = treeData?.treeHeight ?? 0;

  // Layout calculation
  const layout = useMemo(() => layoutTree(root), [root]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.15, 0.5));
  const handleResetZoom = () => setScale(1);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (onSelectStudent) {
      onSelectStudent(node);
    }
  };

  return (
    <div className="bst-visualizer-card glass-panel">
      {/* Header Controls */}
      <div className="bst-header">
        <div className="bst-title-wrap">
          <div className="bst-icon-badge">
            <TreeIcon size={20} />
          </div>
          <div>
            <h3 className="bst-title">Live BST Structure</h3>
            <p className="bst-desc">
              Visualizing the active tree in C++ backend &bull; Ordered by Marks
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bst-toolbar">
          <div className="bst-meta-pills hide-on-mobile">
            <span className="badge badge-primary font-mono">
              Root: {root ? `Roll #${root.rollNo}` : 'None'}
            </span>
            <span className="badge badge-primary font-mono">
              Height: {treeHeight}
            </span>
            <span className="badge badge-primary font-mono">
              Nodes: {totalNodes}
            </span>
          </div>

          <div className="zoom-controls">
            <button 
              type="button" 
              className="btn-icon-sm" 
              onClick={handleZoomOut} 
              title="Zoom Out"
            >
              <ZoomOutIcon size={16} />
            </button>
            <span className="zoom-level font-mono">{Math.round(scale * 100)}%</span>
            <button 
              type="button" 
              className="btn-icon-sm" 
              onClick={handleZoomIn} 
              title="Zoom In"
            >
              <ZoomInIcon size={16} />
            </button>
            <button 
              type="button" 
              className="btn-icon-sm" 
              onClick={handleResetZoom} 
              title="Fit / Reset View"
            >
              <MaximizeIcon size={16} />
            </button>
          </div>

          <button 
            type="button" 
            className="btn-secondary btn-sm" 
            onClick={onRefresh} 
            disabled={isRefreshing}
            title="Re-fetch Tree from C++ backend"
          >
            <RefreshIcon size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hide-on-mobile">Sync Tree</span>
          </button>
        </div>
      </div>

      {/* Visualizer Canvas Area */}
      <div className="bst-canvas-container" ref={containerRef}>
        {!root || totalNodes === 0 ? (
          <div className="bst-empty-state">
            <div className="bst-empty-icon-wrap">
              <TreeIcon size={48} className="empty-tree-icon" />
            </div>
            <h4 className="empty-title">Binary Search Tree is Empty</h4>
            <p className="empty-desc">
              No students are currently stored in the C++ BST. Add a student to generate root and child nodes.
            </p>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={onOpenAddModal}
            >
              Add First Student
            </button>
          </div>
        ) : (
          <div 
            className="bst-canvas-viewport"
            style={{ 
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              width: `${layout.width}px`,
              height: `${layout.height}px`
            }}
          >
            <svg 
              className="bst-svg-edges"
              width={layout.width} 
              height={layout.height}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
            >
              <defs>
                <linearGradient id="edgeGradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="edgeGradientRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Connecting Edges */}
              {layout.edges.map(edge => {
                const midX = (edge.from.x + edge.to.x) / 2;
                const midY = (edge.from.y + edge.to.y) / 2;
                const isLeft = edge.branchType === 'left';
                const strokeColor = isLeft ? 'url(#edgeGradientLeft)' : 'url(#edgeGradientRight)';

                return (
                  <g key={edge.id} className="bst-edge-group">
                    {/* Curved connector */}
                    <path
                      d={`M ${edge.from.x} ${edge.from.y} C ${edge.from.x} ${midY}, ${edge.to.x} ${midY}, ${edge.to.x} ${edge.to.y}`}
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* Branch Indicator Pill (L for Left < Key, R for Right > Key) */}
                    <rect
                      x={midX - 14}
                      y={midY - 9}
                      width="28"
                      height="18"
                      rx="9"
                      fill="#0B172B"
                      stroke={isLeft ? '#38BDF8' : '#818CF8'}
                      strokeWidth="1.2"
                    />
                    <text
                      x={midX}
                      y={midY + 4}
                      textAnchor="middle"
                      className="branch-label font-mono"
                      fill={isLeft ? '#38BDF8' : '#A5B4FC'}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {isLeft ? 'L (<)' : 'R (>)'}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tree Nodes */}
            <div className="bst-nodes-layer">
              {layout.nodes.map(node => {
                const isHighlighted = highlightRollNo && Number(highlightRollNo) === node.rollNo;
                const isSelected = selectedNode && selectedNode.rollNo === node.rollNo;
                const isTopper = node.rank === 1;

                return (
                  <div
                    key={node.id}
                    className={`bst-node ${isHighlighted ? 'bst-node-highlighted' : ''} ${
                      isSelected ? 'bst-node-selected' : ''
                    } ${node.isRoot ? 'bst-node-root' : ''}`}
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`
                    }}
                    onClick={() => handleNodeClick(node)}
                    title={`Click to inspect Roll #${node.rollNo}`}
                  >
                    {/* Pulse ring for search highlight */}
                    {isHighlighted && <span className="bst-pulse-ring"></span>}

                    {/* Node Tag */}
                    <div className="node-top-bar">
                      <span className="node-roll font-mono">#{node.rollNo}</span>
                      <span className={`node-rank-pill ${isTopper ? 'rank-gold' : ''}`}>
                        {isTopper ? '★ Rank 1' : `R${node.rank || '—'}`}
                      </span>
                    </div>

                    {/* Student Name */}
                    <div className="node-name" title={node.name}>
                      {node.name}
                    </div>

                    {/* Marks Pill */}
                    <div className="node-marks-row">
                      <span className="node-marks-value font-mono">{node.marks}</span>
                      <span className="node-marks-unit">marks</span>
                    </div>

                    {node.isRoot && <div className="root-indicator">ROOT</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Node Inspector Drawer (Shown when a node is selected) */}
      {selectedNode && (
        <div className="node-inspector-drawer animate-fade-in">
          <div className="inspector-content">
            <div className="inspector-header">
              <div className="inspector-student">
                <span className="inspector-roll font-mono">Roll #{selectedNode.rollNo}</span>
                <h4 className="inspector-name">{selectedNode.name}</h4>
              </div>
              <button 
                type="button" 
                className="btn-icon-sm" 
                onClick={() => setSelectedNode(null)}
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="inspector-stats-row">
              <div className="inspector-stat">
                <span className="inspector-stat-label">Marks</span>
                <span className="inspector-stat-val font-mono text-cyan">{selectedNode.marks} / 100</span>
              </div>
              <div className="inspector-stat">
                <span className="inspector-stat-label">Class Rank</span>
                <span className="inspector-stat-val font-mono text-gold">
                  {selectedNode.rank === 1 ? '🥇 Rank 1 (Topper)' : `Rank #${selectedNode.rank}`}
                </span>
              </div>
              <div className="inspector-stat">
                <span className="inspector-stat-label">BST Level</span>
                <span className="inspector-stat-val font-mono">Level {selectedNode.level ?? 0}</span>
              </div>
            </div>

            <div className="inspector-actions">
              <button
                type="button"
                className="btn-danger btn-sm"
                onClick={() => {
                  onDeleteRequest(selectedNode);
                  setSelectedNode(null);
                }}
              >
                <TrashIcon size={14} />
                <span>Delete Node from BST</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BST Visualizer Footer Legend */}
      <div className="bst-footer-legend">
        <div className="legend-item">
          <span className="legend-dot root-dot"></span>
          <span>Root Node</span>
        </div>
        <div className="legend-item">
          <span className="legend-pill left-pill">L (&lt;)</span>
          <span>Left Subtree (Marks &lt; Parent)</span>
        </div>
        <div className="legend-item">
          <span className="legend-pill right-pill">R (&gt;)</span>
          <span>Right Subtree (Marks &gt; Parent)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot gold-dot"></span>
          <span>Class Topper (Rank 1)</span>
        </div>
      </div>
    </div>
  );
}
