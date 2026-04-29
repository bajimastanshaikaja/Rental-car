import React, { useState } from "react";

function Mybookings() {
    const [activeTab, setActiveTab] = useState("active");

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-5">
            <h1 className="text-2xl font-bold">My Bookings</h1>
            <p className="text-gray-500 mb-8">
                Manage and track all your car rentals
            </p>

            <div className="flex justify-around mt-12 bg-gray-100 rounded-full border border-gray-300 p-3">

                <div
                    onClick={() => setActiveTab("active")}
                    className={`cursor-pointer px-20 py-2  rounded-full transition-all ${activeTab === "active"
                        ? "bg-white shadow font-medium text-blue-600"
                        : "text-gray-500"
                        }`}
                >
                    Active
                </div>

                <div
                    onClick={() => setActiveTab("completed")}
                    className={`cursor-pointer px-6 py-2 rounded-full transition-all ${activeTab === "completed"
                        ? "bg-white shadow font-medium text-blue-600"
                        : "text-gray-500"
                        }`}
                >
                    Completed
                </div>

                <div
                    onClick={() => setActiveTab("cancelled")}
                    className={`cursor-pointer px-6 py-2 rounded-full transition-all ${activeTab === "cancelled"
                        ? "bg-white shadow font-medium text-blue-600"
                        : "text-gray-500"
                        }`}
                >
                    Cancelled
                </div>

            </div>
        </div>
    );
}

export default Mybookings;