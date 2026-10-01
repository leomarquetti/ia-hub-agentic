import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { AgentNode, AgentNodeData } from './AgentNode';
import { AnimatedDataEdge } from './AnimatedDataEdge';
import { AgentId } from '@/types/agents';
import { AGENT_DEFINITIONS } from '@/agents/agentDefinitions';
import { WorkflowRunState } from '@/types/workflows';

interface WorkflowGraphProps {
  workflowState: WorkflowRunState;
  onSelectAgent: (agentId: AgentId) => void;
  agentRuntimeStates: Record<AgentId, {
    status: any;
    currentTask: string;
    runtimeMs: number;
    toolCallsCount: number;
  }>;
}

const nodeTypes = {
  agentNode: AgentNode,
};

const edgeTypes = {
  animatedEdge: AnimatedDataEdge,
};

export const WorkflowGraph: React.FC<WorkflowGraphProps> = ({
  workflowState,
  onSelectAgent,
  agentRuntimeStates,
}) => {
  // Compute Nodes
  const nodes: Node<AgentNodeData>[] = useMemo(() => {
    return [
      {
        id: 'supervisor',
        type: 'agentNode',
        position: { x: 310, y: 25 },
        data: {
          id: 'supervisor',
          name: AGENT_DEFINITIONS.supervisor.name,
          role: AGENT_DEFINITIONS.supervisor.role,
          status: agentRuntimeStates.supervisor?.status || 'IDLE',
          currentTask: agentRuntimeStates.supervisor?.currentTask || '',
          runtimeMs: agentRuntimeStates.supervisor?.runtimeMs || 0,
          toolCallsCount: agentRuntimeStates.supervisor?.toolCallsCount || 0,
          isActive: workflowState.activeAgentId === 'supervisor',
          isSelected: workflowState.selectedAgentId === 'supervisor',
          badge: AGENT_DEFINITIONS.supervisor.badge,
        },
      },
      {
        id: 'research',
        type: 'agentNode',
        position: { x: 90, y: 210 },
        data: {
          id: 'research',
          name: AGENT_DEFINITIONS.research.name,
          role: AGENT_DEFINITIONS.research.role,
          status: agentRuntimeStates.research?.status || 'IDLE',
          currentTask: agentRuntimeStates.research?.currentTask || '',
          runtimeMs: agentRuntimeStates.research?.runtimeMs || 0,
          toolCallsCount: agentRuntimeStates.research?.toolCallsCount || 0,
          isActive: workflowState.activeAgentId === 'research',
          isSelected: workflowState.selectedAgentId === 'research',
          badge: AGENT_DEFINITIONS.research.badge,
        },
      },
      {
        id: 'analysis',
        type: 'agentNode',
        position: { x: 530, y: 210 },
        data: {
          id: 'analysis',
          name: AGENT_DEFINITIONS.analysis.name,
          role: AGENT_DEFINITIONS.analysis.role,
          status: agentRuntimeStates.analysis?.status || 'IDLE',
          currentTask: agentRuntimeStates.analysis?.currentTask || '',
          runtimeMs: agentRuntimeStates.analysis?.runtimeMs || 0,
          toolCallsCount: agentRuntimeStates.analysis?.toolCallsCount || 0,
          isActive: workflowState.activeAgentId === 'analysis',
          isSelected: workflowState.selectedAgentId === 'analysis',
          badge: AGENT_DEFINITIONS.analysis.badge,
        },
      },
      {
        id: 'report',
        type: 'agentNode',
        position: { x: 310, y: 400 },
        data: {
          id: 'report',
          name: AGENT_DEFINITIONS.report.name,
          role: AGENT_DEFINITIONS.report.role,
          status: agentRuntimeStates.report?.status || 'IDLE',
          currentTask: agentRuntimeStates.report?.currentTask || '',
          runtimeMs: agentRuntimeStates.report?.runtimeMs || 0,
          toolCallsCount: agentRuntimeStates.report?.toolCallsCount || 0,
          isActive: workflowState.activeAgentId === 'report',
          isSelected: workflowState.selectedAgentId === 'report',
          badge: AGENT_DEFINITIONS.report.badge,
        },
      },
    ];
  }, [workflowState.activeAgentId, workflowState.selectedAgentId, agentRuntimeStates]);

  // Compute Edges
  const edges: Edge[] = useMemo(() => {
    return [
      {
        id: 'e-supervisor-research',
        source: 'supervisor',
        target: 'research',
        type: 'animatedEdge',
        data: { isActive: workflowState.activeEdgeId === 'e-supervisor-research' },
      },
      {
        id: 'e-research-analysis',
        source: 'research',
        target: 'analysis',
        type: 'animatedEdge',
        data: { isActive: workflowState.activeEdgeId === 'e-research-analysis' },
      },
      {
        id: 'e-analysis-report',
        source: 'analysis',
        target: 'report',
        type: 'animatedEdge',
        data: { isActive: workflowState.activeEdgeId === 'e-analysis-report' },
      },
      {
        id: 'e-report-supervisor',
        source: 'report',
        target: 'supervisor',
        type: 'animatedEdge',
        data: { isActive: workflowState.activeEdgeId === 'e-report-supervisor' },
      },
    ];
  }, [workflowState.activeEdgeId]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-card-border bg-background-deep/80 backdrop-blur-sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_, node) => onSelectAgent(node.id as AgentId)}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.6}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="#162438"
        />
        <Controls className="!bg-card !border-card-border !fill-text-primary !rounded-lg overflow-hidden [&>button]:!bg-card [&>button]:!border-card-border [&>button]:!text-text-primary hover:[&>button]:!bg-card-hover" />
      </ReactFlow>

      {/* Floating Graph Overlay / Legend */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/80 backdrop-blur-md border border-card-border text-xs text-text-muted">
        <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
        <span className="font-semibold text-text-primary">LangGraph Orchestration Flow</span>
        <span className="text-text-subtle">•</span>
        <span>Interactive Graph Node Selector</span>
      </div>
    </div>
  );
};
