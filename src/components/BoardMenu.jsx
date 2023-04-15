import React, { useState } from "react";
import { BsGear } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";

export const BoardMenu = () => {
  const [inputText, setInputText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleButtonClick = () => {
    console.log(inputText);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div className="p-4 bg-gray-600">
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
          <div>
            <input
              className="border border-gray-300 rounded p-2 w-500"
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type here"
            />
            <button
              className="bg-white border border-gray-300 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-100"
              onClick={handleButtonClick}
            >
              Log Text
            </button>
          </div>
          <div>
            <input
              className="border border-gray-300 rounded p-2 w-500"
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type here"
            />
            <button
              className="bg-white border border-gray-300 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-100"
              onClick={handleButtonClick}
            >
              Log Text
            </button>
          </div>
          <div>
            <input
              className="border border-gray-300 rounded p-2 w-500"
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type here"
            />
            <button
              className="bg-white border border-gray-300 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-100"
              onClick={handleButtonClick}
            >
              Log Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
