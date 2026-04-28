import React, { useEffect, useState, useContext } from "react";
import { doc, updateDoc } from "firebase/firestore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { db } from "@/DB/FirebaseConfig";
import { CarContext } from "@/main";

const UpdateCar = ({ open, setOpen, car }) => {
  const {cars,fetchCars } = useContext(CarContext);
  console.log(cars);

  const [formData, setFormData] = useState({
    carName: "",
    brand: "",
    year: "",
    type: "Sedan",
    seats: "",
    transmission: "Automatic",
    fuelType: "Petrol",
    availability: "Available",
    price: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (car) {
      setFormData(car);
    }
  }, [car]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Update car in Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, "Carsdb", car.id);

      await updateDoc(docRef, formData);

      alert("Car updated successfully ✅");

      fetchCars();
      setOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

 
    

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Update Car</DialogTitle>
            <DialogDescription>
              Modify car details and save changes.
            </DialogDescription>
          </DialogHeader>

          <form className="grid grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>
            {/* Car Name */}
            <div className="col-span-2">
              <label className="font-semibold">Car Name</label>
              <input
                type="text"
                name="carName"
                value={formData.carName}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                required
              />
            </div>

            {/* Brand */}
            <div>
              <label className="font-semibold">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                required
              />
            </div>

            {/* Year */}
            <div>
              <label className="font-semibold">Year</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="font-semibold">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              >
                <option>Sedan</option>
                <option>SUV</option>
                <option>Electric</option>
                <option>Sports</option>
                <option>Compact</option>
                <option>Minivan</option>
              </select>
            </div>

            {/* Seats */}
            <div>
              <label className="font-semibold">Seats</label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                required
              />
            </div>

            {/* Transmission */}
            <div>
              <label className="font-semibold">Transmission</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              >
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>

            {/* Fuel */}
            <div>
              <label className="font-semibold">Fuel Type</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="font-semibold">Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              >
                <option>Available</option>
                <option>Not Available</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="font-semibold">Price Per Hour</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                required
              />
            </div>

            {/* Image URL */}
            <div className="col-span-2">
              <label className="font-semibold">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                required
              />
            </div>

            {/* Button */}
            <div className="col-span-2">
              <button
                
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                {loading ? "Updating..." : "Update Car"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };


export default UpdateCar; 