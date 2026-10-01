import React, { memo } from 'react';
import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react';

export const AnimatedDataEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
  }: EdgeProps) => {
    const [edgePath] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 16,
    });

    const isActive = data?.isActive as boolean;

    return (
      <>
        {/* Base line */}
        <BaseEdge
          path={edgePath}
          markerEnd={markerEnd}
          style={{
            ...style,
            stroke: isActive ? '#19C3FF' : '#52627A',
            strokeWidth: isActive ? 2.5 : 1.5,
            opacity: isActive ? 1 : 0.45,
            transition: 'stroke 0.3s, stroke-width 0.3s, opacity 0.3s',
          }}
        />

        {/* Animated Flow Particles when active */}
        {isActive && (
          <circle r="4" fill="#19C3FF" className="filter drop-shadow-[0_0_6px_#19C3FF]">
            <animateMotion
              dur="1.6s"
              repeatCount="indefinite"
              path={edgePath}
              rotate="auto"
            />
          </circle>
        )}
      </>
    );
  }
);

AnimatedDataEdge.displayName = 'AnimatedDataEdge';
