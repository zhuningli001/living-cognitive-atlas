"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, LazyMotion, domAnimation, m } from "motion/react";
import { useState } from "react";

const positions = [
  { x: 19, y: 31 },
  { x: 70, y: 28 },
  { x: 79, y: 58 },
  { x: 54, y: 78 },
  { x: 28, y: 72 },
  { x: 16, y: 56 },
  { x: 39, y: 23 },
  { x: 83, y: 78 },
  { x: 47, y: 18 },
  { x: 11, y: 78 }
];

const center = { x: 48, y: 51 };
const graphTransition = { type: "spring", stiffness: 115, damping: 22, mass: 0.9 };

export function AttentionMap({ maps, copy }) {
  const availableMaps = maps?.filter((map) => map.nodes?.length) ?? [];
  const [activeId, setActiveId] = useState(availableMaps[0]?.id);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const activeMap = availableMaps.find((map) => map.id === activeId) ?? availableMaps[0];

  if (!activeMap?.nodes?.length) return null;

  const activeCopy = copy.attentionViews?.[activeMap?.id] ?? {};
  const selectedNode = activeMap ? getSelectedNode(activeMap, selectedLabel, copy) : null;
  const centerNode = selectedNode ?? {
    label: activeCopy.center ?? copy.attentionCenter,
    eyebrow: activeCopy.centerEyebrow ?? copy.attentionCenterEyebrow,
    count: activeMap?.nodes?.reduce((total, node) => total + node.count, 0) ?? 0
  };
  const relatedNodes = getRelatedNodes(activeMap, selectedNode).slice(0, positions.length);

  return (
    <section className="py-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-rust/60">{copy.attentionEyebrow}</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">{copy.attentionTitle}</h3>
        </div>
        <p className="max-w-xl text-sm leading-7 text-ink/60">{activeCopy.body ?? copy.attentionBody}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {availableMaps.map((map) => {
          const view = copy.attentionViews?.[map.id] ?? {};
          const isActive = map.id === activeMap.id;
          return (
            <button
              key={map.id}
              type="button"
              onClick={() => {
                setActiveId(map.id);
                setSelectedLabel(null);
              }}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                isActive
                  ? "bg-pine text-white"
                  : "border border-black/5 bg-white/45 text-ink/55 hover:bg-white"
              }`}
            >
              {view.label ?? map.id}
            </button>
          );
        })}
      </div>

      <div
        className="relative mt-5 h-[300px] overflow-hidden bg-[radial-gradient(circle_at_50%_52%,rgba(63,90,75,0.055),transparent_34%)] [perspective:900px]"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          setRotation({ x: y * -7, y: x * 9 });
        }}
        onPointerLeave={() => setRotation({ x: 0, y: 0 })}
      >
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out [transform-style:preserve-3d]"
          style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
        >
        <LazyMotion features={domAnimation}>
        <LayoutGroup id={`attention-${activeMap.id}`}>
        <DepthField />
        <svg className="absolute inset-0 h-full w-full text-pine/30 [transform:translateZ(-18px)]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="attention-rough-line" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="1" seed="11" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.16" />
            </filter>
          </defs>
          <g filter="url(#attention-rough-line)">
            {relatedNodes.map((node, index) => {
              const position = positions[index];
              const midX = (center.x + position.x) / 2;
              const midY = (center.y + position.y) / 2 - (index % 2 === 0 ? 2.2 : -1.4);
              return (
                <m.path
                  key={node.label}
                  d={`M${center.x} ${center.y} Q${midX} ${midY} ${position.x} ${position.y}`}
                  stroke="currentColor"
                  strokeWidth={selectedNode ? "0.075" : "0.095"}
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: selectedNode ? 0.34 : 0.46 }}
                  transition={{ duration: 0.42, ease: "easeOut" }}
                />
              );
            })}
          </g>
        </svg>

        <m.button
          layout
          layoutId={selectedNode ? `attention-node-${activeMap.id}-${selectedNode.label}` : `attention-center-${activeMap.id}`}
          type="button"
          onClick={() => selectedNode && setSelectedLabel(null)}
          className={`absolute z-30 grid place-items-center rounded-full border text-center text-pine ${
            selectedNode
              ? "cursor-zoom-out border-pine/24 bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.98),rgba(247,242,232,0.88)_43%,rgba(63,90,75,0.14)_100%)] shadow-[inset_9px_9px_18px_rgba(255,255,255,0.88),inset_-15px_-17px_28px_rgba(63,90,75,0.09),0_18px_38px_rgba(63,90,75,0.1)]"
              : "border-pine/14 bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.96),rgba(247,242,232,0.82)_46%,rgba(63,90,75,0.1)_100%)] shadow-[inset_9px_9px_18px_rgba(255,255,255,0.85),inset_-14px_-16px_28px_rgba(63,90,75,0.065),0_16px_34px_rgba(63,90,75,0.07)]"
          }`}
          style={{
            left: `${center.x}%`,
            top: `${center.y}%`,
            width: selectedNode ? 134 : 118,
            height: selectedNode ? 134 : 118,
            marginLeft: selectedNode ? -67 : -59,
            marginTop: selectedNode ? -67 : -59
          }}
          transition={graphTransition}
          whileTap={selectedNode ? { scale: 0.97 } : undefined}
          aria-label={selectedNode ? `Reset ${selectedNode.label}` : centerNode.label}
        >
          <m.div layout="position" transition={{ duration: 0.22 }}>
            <p className="text-[9px] uppercase tracking-[0.18em] text-pine/42">{centerNode.eyebrow ?? copy.attentionCenterEyebrow}</p>
            <p className="mt-1 line-clamp-2 px-4 font-serif text-xl leading-tight">{centerNode.label}</p>
            {selectedNode ? <p className="mt-1 text-[9px] text-pine/42">{selectedNode.count} {copy.attentionLinkUnit}</p> : null}
          </m.div>
        </m.button>

        <AnimatePresence initial={false}>
        {relatedNodes.map((node, index) => {
          const position = positions[index];
          const isPrimaryNode = activeMap.nodes.some((item) => item.label === node.label);
          const nodeSize = Math.max(46, Math.min(node.size ?? 52, selectedNode ? 74 : 86));
          return (
            <m.button
              layout
              layoutId={`attention-node-${activeMap.id}-${node.label}`}
              key={node.label}
              type="button"
              onClick={() => setSelectedLabel(node.label)}
              className="absolute z-10 grid place-items-center rounded-full border border-pine/14 bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.92),rgba(255,255,255,0.66)_48%,rgba(63,90,75,0.07)_100%)] p-2 text-center text-pine shadow-[inset_6px_7px_12px_rgba(255,255,255,0.82),inset_-8px_-10px_18px_rgba(63,90,75,0.055),0_8px_18px_rgba(63,90,75,0.045)]"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                width: nodeSize,
                height: nodeSize,
                marginLeft: nodeSize / -2,
                marginTop: nodeSize / -2
              }}
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{
                opacity: selectedNode && !isPrimaryNode ? 0.86 : 1,
                scale: 1
              }}
              exit={{ opacity: 0, scale: 0.74 }}
              transition={graphTransition}
              whileHover={{
                y: -3,
                scale: 1.04,
                transition: { type: "spring", stiffness: 280, damping: 20 }
              }}
              whileTap={{ scale: 0.96 }}
            >
              <m.span layout="position" className="line-clamp-2 px-1 text-[10px] font-medium leading-tight">{node.label}</m.span>
              <m.span layout="position" className="mt-0.5 text-[8px] text-pine/35">{node.count}</m.span>
            </m.button>
          );
        })}
        </AnimatePresence>

        {selectedNode ? (
          <>
            <Link
              href={selectedNode.href}
              className="absolute bottom-2 right-2 z-30 rounded-full border border-black/5 bg-white/70 px-3 py-1.5 text-xs text-pine/70 transition hover:bg-white"
            >
              {copy.attentionOpenKeyword}
            </Link>
          </>
        ) : null}
        </LayoutGroup>
        </LazyMotion>
        </div>
      </div>
    </section>
  );
}

function getSelectedNode(activeMap, selectedLabel, copy) {
  if (!selectedLabel) return null;

  const directNode = activeMap.nodes.find((node) => node.label === selectedLabel);
  if (directNode) {
    return { ...directNode, eyebrow: copy.attentionSelectedEyebrow };
  }

  for (const node of activeMap.nodes) {
    const child = node.children?.find((item) => item.label === selectedLabel);
    if (child) {
      return {
        ...child,
        size: 64,
        href: child.href,
        eyebrow: copy.attentionRelatedEyebrow,
        children: [
          { label: node.label, count: node.count, href: node.href, size: node.size },
          ...(node.children ?? []).filter((item) => item.label !== child.label)
        ]
      };
    }
  }

  return null;
}

function getRelatedNodes(activeMap, selectedNode) {
  if (!selectedNode) return activeMap.nodes;

  const nodesByLabel = new Map();
  const addNode = (node, fallbackSize = 54) => {
    if (!node?.label || node.label === selectedNode.label || nodesByLabel.has(node.label)) return;
    nodesByLabel.set(node.label, {
      ...node,
      size: node.size ?? fallbackSize
    });
  };

  selectedNode.children?.forEach((node) => addNode(node, 50 + Math.min(node.count * 4, 22)));
  activeMap.nodes.forEach((node) => addNode(node));

  return [...nodesByLabel.values()];
}

function DepthField() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full text-pine/20" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="attention-depth-glow" cx="50%" cy="50%" r="52%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.035" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="55" rx="42" ry="22" fill="url(#attention-depth-glow)" />
      <path d="M14 72C30 62 68 62 86 72" stroke="currentColor" strokeWidth="0.12" fill="none" opacity="0.55" />
      <path d="M21 64C36 57 65 57 79 64" stroke="currentColor" strokeWidth="0.1" fill="none" opacity="0.4" />
      <path d="M31 78C42 70 59 70 70 78" stroke="currentColor" strokeWidth="0.09" fill="none" opacity="0.32" />
      <path d="M24 27C40 33 61 33 78 27" stroke="currentColor" strokeWidth="0.08" fill="none" opacity="0.22" />
    </svg>
  );
}
