import React, { useState } from 'react'
import { Users, Fuel, Settings2, CalendarDays, Star, IndianRupee } from 'lucide-react'
import BookingModal from './BookingModal'

function StarRating({ rating = 0 }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={14}
                    className={
                        star <= Math.round(rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 fill-gray-200'
                    }
                />
            ))}
            <span className="text-xs text-gray-500 ml-1">
                {rating ? Number(rating).toFixed(1) : 'No rating'}
            </span>
        </div>
    )
}

function CarCard({ car }) {
    const isAvailable = car.availability === 'Available'
    const [bookingOpen, setBookingOpen] = useState(false)

    return (
        <>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                {/* Car Image */}
                <div className="relative h-48 bg-gray-100">
                    <img
                        src={car.image}
                        alt={car.carName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/400x200?text=No+Image'
                        }}
                    />
                    {/* Availability Badge */}
                    <span
                        className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${
                            isAvailable
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-600'
                        }`}
                    >
                        {car.availability}
                    </span>
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                    {/* Title */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{car.carName}</h2>
                        <p className="text-sm text-gray-500">{car.brand} &bull; {car.type}</p>
                    </div>

                    {/* Star Rating */}
                    <StarRating rating={car.rating} />

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <CalendarDays size={15} className="text-blue-500" />
                            <span>{car.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={15} className="text-blue-500" />
                            <span>{car.seats} Seats</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Settings2 size={15} className="text-blue-500" />
                            <span>{car.transmission}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Fuel size={15} className="text-blue-500" />
                            <span>{car.fuelType}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-100" />

                    {/* Price + Book Button */}
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-0.5">
                            <IndianRupee size={18} className="text-blue-600" strokeWidth={2.5} />
                            <span className="text-xl font-bold text-blue-600">{car.price}</span>
                            <span className="text-xs text-gray-400 ml-1">/ hour</span>
                        </div>
                        <button
                            disabled={!isAvailable}
                            onClick={() => setBookingOpen(true)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                isAvailable
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {isAvailable ? 'Book Now' : 'Unavailable'}
                        </button>
                    </div>
                </div>
            </div>

            <BookingModal open={bookingOpen} setOpen={setBookingOpen} car={car} />
        </>
    )
}

export default CarCard
