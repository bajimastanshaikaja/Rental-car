import React, { useEffect, useState } from "react";
import Addcars from "./../components/Addcars";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import { db } from "@/DB/FirebaseConfig";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UpdateCar from "./UpdateCar";

export const ManageCars = () => {
  const [openupdate, setOpenupdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    const getCars = async () => {
      try {
        const carsCollection = await getDocs(collection(db, "Carsdb"));
        const carcollect = carsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(carcollect);
        console.log(cars);
      } catch (error) {
        console.log(error);
      }
    };
    getCars();
  }, []);

  const deleteRecord = async (docId) => {
  if (!docId) {
    console.log("❌ docId is undefined");
    return;
  }

  const confirmDelete = window.confirm("Are you sure?");

  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "Carsdb", docId));

    setCars((prev) => prev.filter((car) => car.id !== docId));

    alert("Deleted successfully ✅");

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Manage Cars</h1>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Add Cars
        </button>
      </div>
      <Addcars open={open} setOpen={setOpen} />
      <div className="my-5">
        <input
          className="border border-gray-300 p-2 bg-gray-100 rounded-full w-full md:w-1/2 shadow-md"
          placeholder="Search by name or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-amber-500 text-gray-700 text-sm">
            <tr>
              <th className="py-4 px-4">Car</th>
              <th className="py-4 px-3">Type</th>
              <th className="py-4 px-3">Year</th>
              <th className="py-4 px-3">Price/hour</th>
              <th className="py-4 px-3">Status</th>
              <th className="py-4 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={car.image}
                      className="w-14 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{car.carName}</p>
                      <p className="text-xs text-gray-400">{car.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-gray-600">{car.type}</td>
                <td className="px-3 py-3 text-sm text-gray-600">{car.year}</td>
                <td className="px-3 py-3 text-sm text-gray-600">{car.price}</td>
                <td className="px-3 py-3 text-sm text-gray-600">{car.availability}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-3 items-center justify-center">
                    <button
                      onClick={() => { setSelectedCar(car); setOpenupdate(true); }}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      onClick={() => deleteRecord(car.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <UpdateCar open={openupdate} setOpen={setOpenupdate} car={selectedCar} />
      </div>
    </div>
  );
};
