import React, { useState } from "react";
import Addcars from "./../components/Addcars";

export const ManageCars = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  return (
    <div className="p-6">


      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Cars</h1>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Cars
        </button>
      </div>
      <Addcars open={open} setOpen={setOpen} />
      <div className="relative my-6">
        <input className="border border-gray-300  p-2 bg-gray-100 rounded-full w-1/2 mt-5 shadow-md "
          placeholder="Search by name or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}

        />
      </div>

    </div>
  );
};