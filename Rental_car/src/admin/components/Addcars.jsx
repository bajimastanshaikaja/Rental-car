import React, { useState } from 'react';

const Addcars = () => {

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
    image: null
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // handle file separately
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Car</h1>

        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>

          {/* Car Name */}
          <div className="col-span-2">
            <label className="block font-semibold mb-1">Car Name</label>
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
            <label className="block font-semibold mb-1">Brand</label>
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
            <label className="block font-semibold mb-1">Year</label>
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
            <label className="block font-semibold mb-1">Type</label>
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
            <label className="block font-semibold mb-1">Seats</label>
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
            <label className="block font-semibold mb-1">Transmission</label>
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
            <label className="block font-semibold mb-1">Fuel Type</label>
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
            <label className="block font-semibold mb-1">Availability</label>
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
            <label className="block font-semibold mb-1">Price Per Hour</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          {/* Image */}
          <div className="col-span-2">
            <label className="block font-semibold mb-1">Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          {/* Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Add Car
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Addcars;