import React, { useEffect, useState } from "react";
import Addcars from "./../components/Addcars";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/DB/FirebaseConfig";
import { Pencil, Trash2 } from "lucide-react";
import UpdateCar from "./UpdateCar";

export const ManageCars = () => {
  const [openupdate, setOpenupdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  // ✅ FILTER STATES (same as BrowseCars)
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const getCars = async () => {
      try {
        const carsCollection = await getDocs(collection(db, "Carsdb"));
        const carcollect = carsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(carcollect);
      } catch (error) {
        console.log(error);
      }
    };
    getCars();
  }, []);

  // ✅ SAME FILTER LOGIC
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.carName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice =
      maxPrice === "" || Number(car.price) <= Number(maxPrice);

    const matchesRating =
      Number(car.rating ?? 0) >= minRating;

    return matchesSearch && matchesPrice && matchesRating;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setMaxPrice("");
    setMinRating(0);
  };

  const deleteRecord = async (docId) => {
    if (!docId) return;

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

      {/* 🔍 SEARCH + FILTER BUTTON */}
      <div className="flex flex-wrap items-center gap-3 mt-5">
        <input
          placeholder="Search by name or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-full border px-4 py-2 bg-gray-100 w-full md:w-72 shadow-sm"
        />

        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={`px-4 py-2 rounded-full border text-sm ${
            showFilters
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Filters
        </button>

        {(searchQuery || maxPrice || minRating) && (
          <button
            onClick={clearFilters}
            className="text-red-500 text-sm"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ✅ FILTER PANEL */}
      {showFilters && (
        <div className="mt-4 bg-white border rounded-xl p-5 flex flex-wrap gap-8">

          {/* Price */}
          <div>
            <label className="text-sm font-semibold">
              Max Price: {maxPrice || 500}
            </label>
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={maxPrice === "" ? 500 : maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm font-semibold">
              Minimum Rating
            </label>

            <div className="flex gap-2 mt-2">
              {[0,1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(star)}
                  className={`px-3 py-1 rounded-full border ${
                    minRating === star
                      ? "bg-gray-200 text-white"
                      : "bg-white"
                  }`}
                >
                  {star === 0 ? "All" : `${star}★`}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto mt-5">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-200 text-gray-700 text-sm">
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
            {filteredCars.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-5 text-gray-400">
                  No cars found
                </td>
              </tr>
            ) : (
              filteredCars.map((car, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={car.image}
                        className="w-14 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-sm">{car.carName}</p>
                        <p className="text-xs text-gray-400">{car.brand}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3 text-sm">{car.type}</td>
                  <td className="px-3 py-3 text-sm">{car.year}</td>
                  <td className="px-3 py-3 text-sm">{car.price}</td>
                  <td className="px-3 py-3 text-sm">{car.availability}</td>

                  <td className="px-3 py-3">
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => {
                          setSelectedCar(car);
                          setOpenupdate(true);
                        }}
                      >
                        <Pencil size={17} />
                      </button>

                      <button onClick={() => deleteRecord(car.id)}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <UpdateCar open={openupdate} setOpen={setOpenupdate} car={selectedCar} />
      </div>
    </div>
  );
};