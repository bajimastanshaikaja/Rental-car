import React from "react";

export const ManageCars = () => {
  return (
    <div>
      <div className="flex justify-between mx-5">
        <div className="ml-3">
          <h1>Manage Cars</h1>
        </div>
        <div className="mr-3">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Add Cars
          </button>
        </div>
      </div>
    </div>
  );
};
