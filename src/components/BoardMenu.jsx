import React, { useState, useContext } from "react";
import config from "../utils/config.json";

import { MainContext } from "../context/MainContext";
import { BsGear } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";
import { nodes, strategies } from "../data";
import { authorise } from "../utils/account";
import { importEtherscanTX } from "../utils/importer";
import { Loader } from "./";

export const BoardMenu = ({
  setNodes,
  setEdges,
  currentNodes,
  setShowPopup,
}) => {
  const [etherscanLink, setEtherscanLink] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("SCHEDULED_TX");
  const [selectedNode, setSelectedNode] = useState("TRANSFER_NATIVE");
  const { currentAccount, isLoading, setIsLoading } = useContext(MainContext);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const nodeAddClicked = () => {
    const newNode = nodes[selectedNode];

    if (
      newNode.type === "TRIGGER" ||
      newNode.type === "CADENCE" ||
      newNode.type === "TRANSFER_NATIVE"
    ) {
      newNode.data.onChange = onChange;
    }
    setNodes((nodes) => [...nodes.filter((n) => n.id !== newNode.id), newNode]);
  };

  const handleNodeChange = (event) => {
    setSelectedNode(event.target.value);
  };

  const onChange = (value, field, id) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data[field] = value;
        }
        return node;
      })
    );
  };

  const strategyAddClicked = () => {
    const strategy = strategies[selectedStrategy];
    const edgeArray = strategy.edges;
    const nodeArray = strategy.nodes.map((node) => {
      const newNode = nodes[node];
      if (
        node === "TRIGGER" ||
        node === "CADENCE" ||
        node === "TRANSFER_NATIVE"
      ) {
        newNode.data.onChange = onChange;
      }
      return newNode;
    });
    setNodes((_) => nodeArray);
    setEdges((_) => edgeArray);
  };

  const handleStrategyChange = (event) => {
    setSelectedStrategy(event.target.value);
  };

  const linkAddClicked = async () => {
    const res = await importEtherscanTX(etherscanLink);
    console.log({ res });
    const newCustomNode = {
      id: "CUSTOM_NODE_" + res.functionSelector,
      position: { x: 350, y: 350 },
      type: "CUSTOM_NODE",
      data: {
        chainId: 10,
        label: res.functionName,
        value: res.transaction.value,
        target: res.transaction.to,
        functionName: res.functionName,
        params: [...res.decoded],
        functionSelector: res.functionSelector,
      },
    };
    setNodes((nodes) => [
      ...nodes.filter((n) => n.id !== newCustomNode.id),
      newCustomNode,
    ]);
  };

  const handleLinkChange = (event) => {
    setEtherscanLink(event.target.value);
  };

  const autorise = async () => {
    setIsLoading(true);
    try {
      await authorise(currentAccount, config.bot, currentNodes);
      setShowPopup(true);
    } catch (error) {
      console.log({ error });
    }
    setIsLoading(false);
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
                    {nodes[key].data.label}
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
          {isLoading ? (
            <Loader />
          ) : (
            <button
              className="bg-white border border-gray-300 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-100 mt-4 mw-500"
              onClick={autorise}
            >
              Autorise
            </button>
          )}
        </div>
      )}
    </div>
  );
};