import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import { BoardMenu } from "../components";
import { TextFieldNode } from "../components/nodes/";

import "reactflow/dist/style.css";
const initialNodes = [
  {
    id: "START",
    position: { x: 200, y: 200 },
    data: { label: "Start" },
    type: "input",
  },
  {
    id: "END",
    position: { x: 200, y: 500 },
    data: { label: "End" },
    type: "output",
  },
];
const initialEdges = [
  // { id: "e1-2", source: "START", target: "END", animated: true },
];
const defaultEdgeOptions = { animated: true };
const nodeTypes = { textField: TextFieldNode };

export const Board = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <BoardMenu setNodes={setNodes} setEdges={setEdges} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={defaultEdgeOptions}
        nodeTypes={nodeTypes}
        className="bg-gray-700"
      >
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
