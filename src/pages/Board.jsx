import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import { BoardMenu } from "../components";
import "reactflow/dist/style.css";
const initialNodes = [
  {
    id: "1",
    position: { x: 200, y: 200 },
    data: { label: "Start" },
    type: "input",
  },
  {
    id: "2",
    position: { x: 200, y: 500 },
    data: { label: "End" },
    type: "output",
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2", animated: true }];

export const Board = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <BoardMenu />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        className="bg-gray-600"
      >
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
