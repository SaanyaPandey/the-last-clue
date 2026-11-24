
import React, { useState, useMemo, useRef } from 'react';
import { useLanguage } from '../localization/LanguageContext';

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
  onSelectNode,
  examinedClueIds = new Set()
}) {
  const [viewMode, setViewMode] = useState('canvas'); // 'canvas' | 'list'
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const { t, getSuspectText, getClueText, getLocationText, getWeaponText, getMotiveText, getRelationshipText } = useLanguage();

  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];

  // Which clue nodes are "discovered" by the player
  const isNodeDiscovered = (node) => {
    if (node.type !== 'clue') return true; // suspects, locations, weapons always visible
    return examinedClueIds.has(node.id);
  };

  const anyClueDiscovered = nodes.some(
    (n) => n.type === 'clue' && examinedClueIds.has(n.id)
  );

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

  // Helper to get localized node display name
  const getNodeDisplayName = (node) => {
    if (!node) return '';
    switch (node.type) {
      case 'suspect': return getSuspectText(node.id).name || node.label || node.id;
      case 'clue': return getClueText(node.id).name || node.label || node.id;
      case 'location': return getLocationText(node.id).name || node.label || node.id;
      case 'weapon':
      case 'evidence': return getWeaponText(node.id).name || node.label || node.id;
      case 'motive': return getMotiveText(node.id).name || node.label || node.id;
      default: return node.label || node.id;
    }
  };

  // Helper to get localized node description
  const getNodeDisplayDesc = (node) => {
    if (!node) return '';
    switch (node.type) {
      case 'suspect': return getSuspectText(node.id).role || node.metadata?.role || '';
      case 'clue': return getClueText(node.id).description || node.metadata?.description || '';
      case 'location': return getLocationText(node.id).description || node.metadata?.description || '';
      case 'weapon':
      case 'evidence': return getWeaponText(node.id).description || node.metadata?.description || '';
      case 'motive': return getMotiveText(node.id).description || node.metadata?.description || '';
      default: return node.metadata?.description || '';
    }
  };

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
    const weapons = nodes.filter((n) => n.type === 'weapon' || n.type === 'evidence');
    const others = nodes.filter((n) => !['suspect', 'clue', 'location', 'weapon', 'evidence'].includes(n.type));

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
      case 'weapon':
      case 'evidence': return '#cf7143'; // Burnt rust
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
            {t('board.title')}:
          </span>
          <div className="legend-item">
            <span className="legend-dot legend-suspect" /> {t('board.filterSuspects')}
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-clue" /> {t('board.filterClues')}
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-location" /> {t('board.filterRooms')}
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-weapon" /> {t('board.filterWeapons')}
          </div>
        </div>

        <div className="board-controls">
          <div className="panel-filter-bar" style={{ margin: 0 }}>
            <button
              type="button"
              className={`filter-btn ${viewMode === 'canvas' ? 'active' : ''}`}
              onClick={() => setViewMode('canvas')}
            >
              {t('board.toggleCanvas')}
            </button>
            <button
              type="button"
              className={`filter-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              {t('board.toggleList')}
            </button>
          </div>

          {viewMode === 'canvas' && (
            <>
              <button
                type="button"
                className="filter-btn"
                onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
                title={t('board.zoomIn')}
              >
                +
              </button>
              <button
                type="button"
                className="filter-btn"
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
                title={t('board.zoomOut')}
              >
                -
              </button>
              <button
                type="button"
                className="filter-btn"
                onClick={handleResetView}
                title={t('board.resetView')}
              >
                {t('board.resetView')}
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
          {/* EMPTY STATE / STARTING PINBOARD */}
          {!anyClueDiscovered && nodes.length > 0 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 2,
                gap: '1rem'
              }}
            >
              <div
                style={{
                  background: 'rgba(12,16,23,0.92)',
                  border: '2px solid rgba(212,163,89,0.4)',
                  borderRadius: '8px',
                  padding: '1.25rem 2rem',
                  textAlign: 'center',
                  maxWidth: '360px'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📌</div>
                <div
                  className="font-title"
                  style={{ color: 'var(--amber-light)', fontSize: '1rem', marginBottom: '0.5rem' }}
                >
                  {t('board.startingLead')}
                </div>
                <p style={{ color: '#9d9487', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                  {t('board.emptyStateHint')}
                </p>
              </div>
            </div>
          )}

          <svg
            ref={svgRef}
            className="graph-svg"
            viewBox="0 0 900 560"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
              <filter id="fog-blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" />
              </filter>
            </defs>

            {/* Transform Container for Zoom and Pan */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* EDGES (Connecting strings) */}
              {edges.map((edge, index) => {
                const posA = layoutPositions.get(edge.source);
                const posB = layoutPositions.get(edge.target);
                if (!posA || !posB) return null;

                const srcNode = nodeMap.get(edge.source);
                const tgtNode = nodeMap.get(edge.target);
                const srcDiscovered = srcNode ? isNodeDiscovered(srcNode) : true;
                const tgtDiscovered = tgtNode ? isNodeDiscovered(tgtNode) : true;
                const edgeDiscovered = srcDiscovered && tgtDiscovered;

                const isConnectedToSelected =
                  selectedNodeId &&
                  (edge.source === selectedNodeId || edge.target === selectedNodeId);

                const midX = (posA.x + posB.x) / 2;
                const midY = (posA.y + posB.y) / 2;
                const relLabel = getRelationshipText(edge.relationship);

                return (
                  <g key={`edge-${index}`} className="graph-edge-group" opacity={edgeDiscovered ? 1 : 0.2}>
                    <line
                      x1={posA.x}
                      y1={posA.y}
                      x2={posB.x}
                      y2={posB.y}
                      className={`graph-edge ${isConnectedToSelected ? 'highlighted' : ''}`}
                      strokeDasharray={edgeDiscovered ? undefined : '4 4'}
                    />
                    {edgeDiscovered && (
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-38"
                          y="-9"
                          width="76"
                          height="18"
                          rx="3"
                          fill="#0c1017"
                          stroke={
                            isConnectedToSelected
                              ? 'var(--amber-light)'
                              : 'rgba(212, 163, 89, 0.3)'
                          }
                          strokeWidth="1"
                        />
                        <text
                          textAnchor="middle"
                          y="3"
                          fill={isConnectedToSelected ? 'var(--amber-light)' : '#aba191'}
                          fontSize="8px"
                          fontFamily="var(--font-mono)"
                        >
                          {relLabel.length > 14 ? relLabel.slice(0, 13) + '..' : relLabel}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* NODES (Pins on board) */}
              {nodes.map((node) => {
                const pos = layoutPositions.get(node.id);
                if (!pos) return null;

                const isSelected = selectedNodeId === node.id;
                const isStart = node.id === startingClueId;
                const discovered = isNodeDiscovered(node);
                const nodeColor = discovered ? getNodeColor(node.type, isStart) : '#3a3f4a';
                const radius = isStart ? 22 : 18;
                const displayName = discovered ? getNodeDisplayName(node) : '???';

                return (
                  <g
                    key={node.id}
                    className={`graph-node ${isSelected ? 'selected' : ''}`}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    opacity={discovered ? 1 : 0.4}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!discovered) return; // can't select undiscovered nodes
                      onSelectNode(node.id === selectedNodeId ? null : node.id);
                    }}
                    style={{ cursor: discovered ? 'pointer' : 'default' }}
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
                      filter={
                        isSelected
                          ? 'url(#node-glow)'
                          : !discovered
                            ? 'url(#fog-blur)'
                            : undefined
                      }
                    />

                    {/* Center Icon or Abbreviation */}
                    <text
                      y={4}
                      textAnchor="middle"
                      fill={discovered ? '#ffffff' : '#888'}
                      fontSize={radius > 18 ? '11px' : '9px'}
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                      pointerEvents="none"
                    >
                      {!discovered ? '?' : isStart ? '★' : (node.type ? node.type[0].toUpperCase() : '•')}
                    </text>

                    {/* Label below node */}
                    <text
                      y={radius + 15}
                      className="node-label-text"
                      fill={discovered ? undefined : '#666'}
                    >
                      {displayName.length > 18 ? displayName.slice(0, 17) + '..' : displayName}
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
                    {t(`board.types.${activeNode.type}`) ||
                      (activeNode.type ? activeNode.type.toUpperCase() : 'EVIDENCE')}
                  </span>
                  <h4 className="drawer-title font-title">
                    {getNodeDisplayName(activeNode)}
                  </h4>
                </div>
                <button
                  type="button"
                  className="btn-close-drawer"
                  onClick={() => onSelectNode(null)}
                  aria-label={t('board.closeDrawer')}
                >
                  ✕
                </button>
              </div>

              {activeNode.id === startingClueId && (
                <div className="lead-stamp" style={{ position: 'static', alignSelf: 'flex-start' }}>
                  {t('board.startingLead')}
                </div>
              )}

              <p style={{ fontSize: '0.8rem', color: '#b9af9e', margin: '0' }}>
                {getNodeDisplayDesc(activeNode)}
              </p>

              <div style={{ marginTop: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-amber)'
                  }}
                >
                  {t('board.connectedEvidence')} ({activeNodeConnections.length}):
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
                          {conn.direction === 'out' ? '→' : '←'}{' '}
                          {getRelationshipText(conn.relationship)}
                        </span>
                        <strong style={{ color: 'var(--text-ivory)' }}>
                          {getNodeDisplayName(targetNode) || conn.targetId}
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
              {t('board.listTitle')}
            </h3>
            <span className="badge badge-amber">
              {nodes.length} {t('board.nodesLabel')} • {edges.length} {t('board.edgesLabel')}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {nodes.map((node) => {
              const conns = connectionsMap.get(node.id) || [];
              const isStart = node.id === startingClueId;
              const displayName = getNodeDisplayName(node);

              return (
                <div key={node.id} className="list-node-row">
                  <div className="list-node-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${node.type === 'suspect' ? 'badge-burgundy' : 'badge-slate'}`}>
                        {t(`board.types.${node.type}`) || node.type.toUpperCase()}
                      </span>
                      <strong style={{ color: 'var(--text-ivory)' }}>{displayName}</strong>
                      {isStart && <span className="lead-stamp" style={{ position: 'static' }}>{t('board.startingLead')}</span>}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {conns.length} {t('board.connectionsCount')}
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
                              {getRelationshipText(conn.relationship)}
                            </span>{' '}
                            → {getNodeDisplayName(targetNode) || conn.targetId}
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
