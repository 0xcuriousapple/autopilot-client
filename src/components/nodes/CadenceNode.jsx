import { useCallback, useState } from "react";
import { Handle, Position } from "reactflow";

export const CadenceNode = ({ data, id }) => {
  const [count, setCount] = useState(data.count);
  const [cadence, setCadence] = useState(data.cadence);

  return (
    <div className="h-22 border border-gray-200 p-1 rounded bg-cyan-200">
      <Handle type="source" position={Position.Top} />
      <div className="flex flex-col">
        <label className="block text-gray-600 text-xs" htmlFor="text">
          {data.label}
        </label>
        <input
          id="count"
          name="count"
          type="number"
          placeholder="count"
          step="1"
          onChange={(e) => {
            setCount(e.target.value);
            data.onChange(e.target.value, "count", id);
          }}
          className="nodrag mt-2 border-gray-600 border-2 bg-cyan-200"
          value={count}
        />
        <input
          id="cadence"
          name="cadence"
          type="text"
          placeholder="cadence"
          onChange={(e) => {
            setCadence(e.target.value);
            data.onChange(e.target.value, "cadence", id);
          }}
          className="nodrag mt-2 border-gray-600 border-2 bg-cyan-200"
          value={cadence}
        />
      </div>
      <Handle type="target" position={Position.Bottom} id="a" />
    </div>
  );
};
