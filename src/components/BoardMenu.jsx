import React, { useState } from "react";
import { BsGear } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";
import { nodes, strategies } from "../data";

export const BoardMenu = ({ setNodes, setEdges }) => {
  const [etherscanLink, setEtherscanLink] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("SCHEDULED_TX");
  const [selectedNode, setSelectedNode] = useState("TRANSFER_NATIVE");

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const nodeAddClicked = () => {
    const newNode = nodes[selectedNode];
    if (newNode.type === "textField") {
      newNode.data = { onChange, ...newNode.data };
    }
    setNodes((nodes) => [...nodes, newNode]);
  };

  const handleNodeChange = (event) => {
    setSelectedNode(event.target.value);
  };

  const onChange = (event) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== "TRANSFER_NATIVE") {
          return node;
        }

        const amount = event.target.value;

        return {
          ...node,
          data: {
            ...node.data,
            value: amount,
          },
        };
      })
    );
  };

  const strategyAddClicked = () => {
    const strategy = strategies[selectedStrategy];
    const edgeArray = strategy.edges;
    const nodeArray = strategy.nodes.map((node) => {
      if (node.type === "textField") {
        return { data: { onChange, ...nodes[node].data }, ...nodes[node] };
      } else {
        return nodes[node];
      }
    });
    setNodes((_) => nodeArray);
    setEdges((_) => edgeArray);
  };

  const handleStrategyChange = (event) => {
    setSelectedStrategy(event.target.value);
  };

  const linkAddClicked = () => {
    console.log(etherscanLink);
  };

  const handleLinkChange = (event) => {
    setEtherscanLink(event.target.value);
  };

  return (
    <div className="p-4 bg-gray-700">
      <div className="flex justify-end px-10">
        <div
          onClick={toggleCollapse}
          className="w-10 h-10 flex justify-center items-center"
        >
          {isCollapsed ? (
            <BsGear fontSize={45} color="#fff" />
          ) : (
            <BsXLg fontSize={45} color="#fff" />
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col md:flex-row items-center justify-around mt-4">
          <div className="p-4">
            <select
              className="border border-gray-300 rounded p-2 w-500"
              value={selectedNode}
              onChange={handleNodeChange}
            >
              {Object.keys(nodes)
                .filter((key) => key != "default")
                .map((key) => (
                  <option value={key} key={key}>
                    {nodes[key].id}
                  </option>
                ))}
            </select>
            <button
              className="bg-white border border-gray-300 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-100 mt-4 w-500"
              onClick={nodeAddClicked}
            >
              Add Action
            </button>
          </div>
          <div className="p-4">
            <select
              className="border border-gray-300 rounded p-2 w-500"
              value={selectedStrategy}
              onChange={handleStrategyChange}
            >
              {Object.keys(strategies)
                .filter((key) => key != "default")
                .map((key) => (
                  <option value={key} key={key}>
                    {strategies[key].name}
                  </option>
                ))}
            </select>
            <button
              className="bg-white border border-gray-300 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-100 mt-4 w-500"
              onClick={strategyAddClicked}
            >
              Add Preset Strategy
            </button>
          </div>

          <div className="p-4">
            <input
              className="border border-gray-300 rounded p-2 w-500"
              type="text"
              value={etherscanLink}
              onChange={handleLinkChange}
              placeholder="Etherscan Link"
            />
            <button
              className="bg-white border border-gray-300 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-100 mt-4 mw-500"
              onClick={linkAddClicked}
            >
              Import Action
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
