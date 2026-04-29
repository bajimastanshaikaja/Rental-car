import React, { useContext, useState } from 'react'
// import CarCard from './CarCard';
import { CarContext } from '@/main'

function BrowseCars() {
    const { cars, fetchCars } = useContext(CarContext);
    console.log(cars);
    const [searchCars, setSearchCars] = useState("");
    return (
        <div className='min-h-screen bg-gray-50 py-8 px-5 '>
            <div className='flex text-2xl font-bold'>
                Browse Cars

            </div>
            <div>
                <p className='text-gray-600 mt-2'>
                    Find your next ride with our wide range of cars
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <input
                        placeholder="Search by name or brand..."
                        value={searchCars}
                        onChange={(e) => setSearchCars(e.target.value)}
                        className="rounded-full border border-gray-300 p-2 bg-gray-100 w-1/2 mt-5 shadow-md"
                    />
                </div>
            </div>
            {/* <CarCard /> */}

        </div>
    )
}

export default BrowseCars