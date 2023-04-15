import { useCallback, useState } from "react";
import { Handle, Position } from "reactflow";

export const TextFieldNode = ({ data }) => {
  return (
    <div className="h-22 border border-gray-200 p-1 rounded bg-white">
      <Handle type="target" position={Position.Top} />
      <div>
        <label className="block text-gray-600 text-xs" htmlFor="text">
          {data.label}
        </label>
        <input
          id="text"
          name="text"
          type="number"
          placeholder="wei"
          onChange={data.onChange}
          className="nodrag mt-2"
          value={data.amount}
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};
