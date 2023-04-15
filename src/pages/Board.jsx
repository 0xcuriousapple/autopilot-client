import React, { useCallback, useContext } from "react";
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import { MainContext } from "../context/MainContext";
import { BoardMenu, Popup } from "../components";
import {
  TransferNode,
  CadenceNode,
  TriggerNode,
  CustomNode,
} from "../components/nodes/";

import "reactflow/dist/style.css";
import { cleanJson } from "../utils/jsonCleaner";
const initialNodes = [
  {
    id: "START",
    position: { x: 200, y: 200 },
    data: { label: "Start" },
  },
  {
    id: "END",
    position: { x: 200, y: 500 },
    data: { label: "End" },
  },
];
const initialEdges = [
  // { id: "e1-2", source: "START", target: "END", animated: true },
];
const defaultEdgeOptions = { animated: true };
const nodeTypes = {
  TRANSFER_NATIVE: TransferNode,
  CADENCE: CadenceNode,
  TRIGGER: TriggerNode,
  CUSTOM_NODE: CustomNode,
};

export const Board = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { showPopup, setShowPopup } = useContext(MainContext);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  console.log({ nodes });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Popup show={showPopup} onClose={() => setShowPopup(false)}>
        <h2 className="text-2xl font-bold mb-4">Export Strategy</h2>
        <textarea
          cols="200"
          rows="20"
          wrap="hard"
          className="border border-gray-300 rounded p-2 w-full my-4 text-black text-sm"
          type="textarea"
          value={JSON.stringify(cleanJson({ nodes, edges }), null, 2)}
          readOnly
        />
      </Popup>
      <BoardMenu
        setNodes={setNodes}
        setEdges={setEdges}
        currentNodes={nodes}
        setShowPopup={setShowPopup}
      />
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