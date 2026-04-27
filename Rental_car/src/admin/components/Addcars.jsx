import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../DB/FirebaseConfig";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";



const Addcars = ({ open, setOpen }) => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        await addDoc(collection(db, "Carsdb"), formData);
        // close popup after submit
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

                <DialogHeader>
                    <DialogTitle>Add New Car</DialogTitle>
                    <DialogDescription>
                        Fill the details below to add a new car.
                    </DialogDescription>
                </DialogHeader>

                <form className="grid grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>

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

                    <div className="col-span-2">
                        <label className="font-semibold">Image</label>
                        <input
                            type="text"
                            name="image"   // ✅ ADD THIS
                            value={formData.image}  // ✅ ADD THIS
                            onChange={handleChange}
                            className="w-full border p-2 rounded-lg"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                        >
                            Add Car
                        </button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Addcars;