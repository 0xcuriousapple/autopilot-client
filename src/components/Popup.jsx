import React from "react";

export const Popup = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 ">
      <div className="relative bg-white rounded-lg p-6 max-w-full mx-6 md:max-w-md md:mx-0 overflow-auto  text-white font-semibold gradient-bg-popup ">
        {children}
        <button
          className="absolute top-2 right-2 cursor-pointer text-lg font-bold"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};
