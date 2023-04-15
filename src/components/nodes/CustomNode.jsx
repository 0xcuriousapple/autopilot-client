import { useState } from "react";
import { Handle, Position } from "reactflow";

export const CustomNode = ({ data, id }) => {
  console.log({ data });
  return (
    <div className="h-22 border border-gray-200 p-1 rounded bg-purple-200">
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col">
        <label className="block text-gray-600 text-xs" htmlFor="text">
          {data.label} on {data.target}
        </label>
        {data.params.map((p, i) => (
          <input
            type="text"
            className="nodrag mt-2 border-gray-600 border-2 bg-purple-200"
            value={p}
            key={id + i}
            readOnly
          />
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};
