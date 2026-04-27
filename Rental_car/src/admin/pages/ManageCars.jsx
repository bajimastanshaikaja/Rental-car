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
        <input
          className="border border-gray-300  p-2 bg-gray-100 rounded-full w-1/2 mt-5 shadow-md "
          placeholder="Search by name or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-amber-500 text-gray-600 text-sm py-5 m-5">
            <tr>
              <th className="py-5 px-3">Car</th>
              <th>Type</th>
              <th>Year</th>
              <th>Price/hour</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className="p-3">
                <td className="mt-3 flex">
                  <img
                    src={car.image}
                    className="w-15 rounded-sm h-15 object-cover"
                  />
                  <b>{car.carName}</b><br></br>

                  <p>{car.brand}</p>
                </td>
                {console.log(car.image)}
                <td className="p-2">{car.type}</td>
                <td className="p-2">{car.year}</td>
                <td className="p-2">{car.price}</td>
                <td className="p-2">{car.availability}</td>
                <td className="p-2 flex gap-3 items-center mt-5 justify-center ">
                  <button
                    onClick={() => {
                      setSelectedCar(car); 
                      setOpenupdate(true); 
                    }}
                  >
                    <Pencil />
                  </button>

                  <button onClick={()=>deleteRecord(car.id)}>
                    <Trash2 />
                  </button>
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
