import React, { useState, useMemo, useRef, useEffect } from 'react';

/**
 * EvidenceBoard Component
 * Visualizes the real public graph constructed by the backend procedural engine.
 * Renders actual nodes & edges, relationship labels, interactive inspection,
 * and an accessible list-based connection index.
 */
export default function EvidenceBoard({
  graph = { nodes: [], edges: [] },
  startingClueId,
  selectedNodeId,
  onSelectNode
}) {
  const [viewMode, setViewMode] = useState('canvas'); // 'canvas' | 'list'
  const [activeTypeFilter, setActiveTypeFilter] = useState('all'); // 'all' | 'suspect' | 'clue' | 'location' | 'weapon'
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];

  // Map of nodes for instant lookup
  const nodeMap = useMemo(() => {
    const map = new Map();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Compute node adjacency / connections
  const connectionsMap = useMemo(() => {
    const map = new Map();
    nodes.forEach((n) => map.set(n.id, []));
    edges.forEach((edge) => {
      if (map.has(edge.source)) {
        map.get(edge.source).push({
          targetId: edge.target,
          relationship: edge.relationship,
          direction: 'out'
        });
      }
      if (map.has(edge.target)) {
        map.get(edge.target).push({
          targetId: edge.source,
          relationship: edge.relationship,
          direction: 'in'
        });
      }
    });
    return map;
  }, [nodes, edges]);

  // Stable procedural layout for graph nodes inside a 900x560 coordinate space
  const layoutPositions = useMemo(() => {
    const positions = new Map();
    const width = 900;
    const height = 560;
    const centerX = width / 2;
    const centerY = height / 2;

    if (nodes.length === 0) return positions;

    // Group nodes by type for organized aesthetic pinboard positioning
    const suspects = nodes.filter((n) => n.type === 'suspect');
    const clues = nodes.filter((n) => n.type === 'clue');
    const locations = nodes.filter((n) => n.type === 'location');
    const weapons = nodes.filter((n) => n.type === 'weapon');
    const others = nodes.filter((n) => !['suspect', 'clue', 'location', 'weapon'].includes(n.type));

    // Place suspects in an upper-center arc
    suspects.forEach((node, i) => {
      const angle = Math.PI + (Math.PI / (suspects.length + 1)) * (i + 1);
      const radiusX = 260;
      const radiusY = 160;
      positions.set(node.id, {
        x: centerX + Math.cos(angle) * radiusX,
        y: centerY - 40 + Math.sin(angle) * radiusY
      });
    });

    // Place clues in a central/lower radiating cluster
    clues.forEach((node, i) => {
      const isStart = node.id === startingClueId;
      if (isStart) {
        // Place initial lead prominently
        positions.set(node.id, { x: centerX, y: centerY + 20 });
      } else {
        const step = ((i + 1) / (clues.length + 1)) * Math.PI * 1.5;
        const dist = 180;
        positions.set(node.id, {
          x: centerX + Math.cos(step) * dist,
          y: centerY + 70 + Math.sin(step) * 110
        });
      }
    });

    // Place locations on the left flank
    locations.forEach((node, i) => {
      const yStep = height * 0.2 + (height * 0.6 / (locations.length + 1)) * (i + 1);
      positions.set(node.id, { x: 130, y: yStep });
    });

    // Place weapons on the right flank
    weapons.forEach((node, i) => {
      const yStep = height * 0.2 + (height * 0.6 / (weapons.length + 1)) * (i + 1);
      positions.set(node.id, { x: width - 130, y: yStep });
    });

    // Fallback for others (motives, etc.)
    others.forEach((node, i) => {
      const angle = (2 * Math.PI / Math.max(1, others.length)) * i;
      positions.set(node.id, {
        x: centerX + Math.cos(angle) * 310,
        y: centerY + Math.sin(angle) * 200
      });
    });

    return positions;
  }, [nodes, startingClueId]);

  // Selected node details
  const activeNode = nodeMap.get(selectedNodeId);
  const activeNodeConnections = selectedNodeId ? (connectionsMap.get(selectedNodeId) || []) : [];

  // Pan & Drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Node type color styling
  const getNodeColor = (type, isStart = false) => {
    if (isStart) return '#d4a359'; // Amber gold for initial lead
    switch (type) {
      case 'suspect': return '#d44a6b'; // Crimson rose
      case 'clue': return '#e6b86e'; // Amber
      case 'location': return '#3fa1a9'; // Deep teal
      case 'weapon': return '#cf7143'; // Burnt rust
      case 'motive': return '#9667c4'; // Muted purple
      default: return '#7b8a99';
    }
  };

  return (
    <div className="board-container">
      {/* Top Board Toolbar */}
      <div className="board-toolbar">
        <div className="board-legend">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            EVIDENCE NODES:
          </span>
          <div className="legend-item">
            <span className="legend-dot legend-suspect" /> Suspects
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-clue" /> Clues
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-location" /> Rooms
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-weapon" /> Weapons
          </div>
        </div>

        <div className="board-controls">
          <div className="panel-filter-bar" style={{ margin: 0 }}>
            <button
              type="button"
              className={`filter-btn ${viewMode === 'canvas' ? 'active' : ''}`}
              onClick={() => setViewMode('canvas')}
            >
              Pinboard (Canvas)
            </button>
            <button
              type="button"
              className={`filter-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              Connection Index (List)
            </button>
          </div>

          {viewMode === 'canvas' && (
            <>
              <button
                type="button"
                className="filter-btn"
                onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                className="filter-btn"
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
                title="Zoom Out"
              >
                -
              </button>
              <button
                type="button"
                className="filter-btn"
                onClick={handleResetView}
                title="Reset View"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* VIEW MODE: INTERACTIVE CANVAS */}
      {viewMode === 'canvas' && (
        <div
          className="board-canvas-wrapper"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg
            ref={svgRef}
            className="graph-svg"
            viewBox="0 0 900 560"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* RENDER GRAPH EDGES */}
              {edges.map((edge, index) => {
                const srcPos = layoutPositions.get(edge.source);
                const tgtPos = layoutPositions.get(edge.target);
                if (!srcPos || !tgtPos) return null;

                const isIncident = selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId);
                const midX = (srcPos.x + tgtPos.x) / 2;
                const midY = (srcPos.y + tgtPos.y) / 2;

                return (
                  <g key={`edge-${index}`}>
                    <line
                      x1={srcPos.x}
                      y1={srcPos.y}
                      x2={tgtPos.x}
                      y2={tgtPos.y}
                      className={`edge-line ${isIncident ? 'highlighted' : ''}`}
                    />
                    {edge.relationship && (
                      <text
                        x={midX}
                        y={midY - 4}
                        className="edge-label-text"
                      >
                        {edge.relationship.replace(/_/g, ' ')}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* RENDER GRAPH NODES */}
              {nodes.map((node) => {
                const pos = layoutPositions.get(node.id);
                if (!pos) return null;

                const isSelected = selectedNodeId === node.id;
                const isStart = node.id === startingClueId;
                const nodeColor = getNodeColor(node.type, isStart);
                const radius = isStart ? 22 : (node.type === 'suspect' ? 20 : 16);

                return (
                  <g
                    key={node.id}
                    className={`graph-node ${isSelected ? 'selected' : ''}`}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNode(node.id === selectedNodeId ? null : node.id);
                    }}
                  >
                    {/* Shadow / Ring for Selected or Starting Lead */}
                    {isSelected && (
                      <circle
                        r={radius + 8}
                        fill="none"
                        stroke="#d4a359"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        opacity="0.8"
                      />
                    )}

                    {isStart && !isSelected && (
                      <circle
                        r={radius + 5}
                        fill="none"
                        stroke="#e6b86e"
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                    )}

                    {/* Node Core Circle */}
                    <circle
                      r={radius}
                      fill={nodeColor}
                      className="node-pin"
                      filter={isSelected ? 'url(#node-glow)' : undefined}
                    />

                    {/* Center Icon or Abbreviation */}
                    <text
                      y={4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={radius > 18 ? '11px' : '9px'}
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                      pointerEvents="none"
                    >
                      {isStart ? '★' : (node.type ? node.type[0].toUpperCase() : '•')}
                    </text>

                    {/* Label below node */}
                    <text
                      y={radius + 15}
                      className="node-label-text"
                    >
                      {node.label || node.id}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* INSPECTION DRAWER OVERLAY */}
          {activeNode && (
            <div className="node-inspector-drawer" role="region" aria-label="Evidence Inspector">
              <div className="drawer-header">
                <div>
                  <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                    {activeNode.type ? activeNode.type.toUpperCase() : 'EVIDENCE'}
                  </span>
                  <h4 className="drawer-title font-title">
                    {activeNode.label || activeNode.id}
                  </h4>
                </div>
                <button
                  type="button"
                  className="btn-close-drawer"
                  onClick={() => onSelectNode(null)}
                  aria-label="Close Inspector"
                >
                  ✕
                </button>
              </div>

              {activeNode.id === startingClueId && (
                <div className="lead-stamp" style={{ position: 'static', alignSelf: 'flex-start' }}>
                  ★ PROCEDURAL INITIAL LEAD
                </div>
              )}

              <p style={{ fontSize: '0.8rem', color: '#b9af9e', margin: '0' }}>
                {activeNode.metadata?.description || 'Entity logged into police evidence register.'}
              </p>

              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-amber)' }}>
                  CONNECTED EVIDENCE ({activeNodeConnections.length}):
                </span>

                <div className="drawer-connections-list">
                  {activeNodeConnections.map((conn, idx) => {
                    const targetNode = nodeMap.get(conn.targetId);
                    return (
                      <div
                        key={idx}
                        className="connection-item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onSelectNode(conn.targetId)}
                      >
                        <span className="connection-rel">
                          {conn.direction === 'out' ? '→' : '←'} {conn.relationship ? conn.relationship.replace(/_/g, ' ') : 'connected to'}
                        </span>
                        <strong style={{ color: 'var(--text-ivory)' }}>
                          {targetNode?.label || conn.targetId}
                        </strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE: ACCESSIBLE CONNECTION INDEX (LIST) */}
      {viewMode === 'list' && (
        <div className="board-list-view">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="font-title" style={{ fontSize: '1.1rem', color: 'var(--text-ivory)' }}>
              CONNECTED EVIDENCE REPOSITORY
            </h3>
            <span className="badge badge-amber">
              {nodes.length} Nodes • {edges.length} Edges
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {nodes.map((node) => {
              const conns = connectionsMap.get(node.id) || [];
              const isStart = node.id === startingClueId;

              return (
                <div key={node.id} className="list-node-row">
                  <div className="list-node-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${node.type === 'suspect' ? 'badge-burgundy' : 'badge-slate'}`}>
                        {node.type.toUpperCase()}
                      </span>
                      <strong style={{ color: 'var(--text-ivory)' }}>{node.label || node.id}</strong>
                      {isStart && <span className="lead-stamp" style={{ position: 'static' }}>★ STARTING LEAD</span>}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {conns.length} connections
                    </span>
                  </div>

                  {conns.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                      {conns.map((conn, idx) => {
                        const targetNode = nodeMap.get(conn.targetId);
                        return (
                          <span
                            key={idx}
                            className="trait-pill"
                            style={{ cursor: 'pointer', background: 'rgba(212, 163, 89, 0.08)' }}
                            onClick={() => {
                              onSelectNode(conn.targetId);
                              setViewMode('canvas');
                            }}
                          >
                            <span style={{ color: 'var(--amber-light)' }}>
                              {conn.relationship ? conn.relationship.replace(/_/g, ' ') : 'linked'}
                            </span>{' '}
                            → {targetNode?.label || conn.targetId}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
