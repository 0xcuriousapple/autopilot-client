import { useState } from "react";
import { Handle, Position } from "reactflow";

export const TriggerNode = ({ data, id }) => {
  const [date, setDate] = useState("");

  return (
    <div className="h-22 border border-gray-200 p-1 rounded bg-green-200">
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col">
        <label className="block text-gray-600 text-xs" htmlFor="text">
          {data.label}
        </label>

        <input
          type="datetime-local"
          id="trigger-time"
          name="trigger-time"
          className="mt-4 bg-green-200 border-gray-600	border-2"
          onChange={(e) => {
            setDate(e.target.value);
            data.onChange(e.target.value, "date", id);
          }}
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};
