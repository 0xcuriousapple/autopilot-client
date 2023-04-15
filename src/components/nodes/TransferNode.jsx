import { useCallback, useState } from "react";
import { Handle, Position } from "reactflow";

export const TransferNode = ({ data, id }) => {
  const [value, setValue] = useState(data.value);
  const [target, setTarget] = useState(data.target);

  return (
    <div className="h-22 border border-gray-200 p-1 rounded bg-white">
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col">
        <label className="block text-gray-600 text-xs" htmlFor="text">
          {data.label}
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          placeholder="wei"
          step="1"
          onChange={(e) => {
            setValue(e.target.value);
            data.onChange(e.target.value, "value", id);
          }}
          className="nodrag mt-2 border-gray-300	border-2"
          value={value}
        />
        <input
          id="target"
          name="target"
          type="text"
          placeholder="address"
          onChange={(e) => {
            setTarget(e.target.value);
            data.onChange(e.target.value, "target", id);
          }}
          className="nodrag mt-2 border-gray-300	border-2"
          value={target}
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};
