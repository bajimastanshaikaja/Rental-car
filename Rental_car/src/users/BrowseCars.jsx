import React, { useContext, useEffect, useState } from 'react'
import { CarContext } from '@/main'
import CarCard from './CarCard'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/DB/FirebaseConfig'
import { SlidersHorizontal, X } from 'lucide-react'

function BrowseCars() {
    const { cars } = useContext(CarContext)
    const [searchCars, setSearchCars] = useState('')

    // Filter state
    const [maxPrice, setMaxPrice] = useState('')
    const [minRating, setMinRating] = useState(0)
    const [showFilters, setShowFilters] = useState(false)

    const filteredCars = cars.filter((car) => {
        const matchesSearch =
            car.carName?.toLowerCase().includes(searchCars.toLowerCase()) ||
            car.brand?.toLowerCase().includes(searchCars.toLowerCase())

        const matchesPrice = maxPrice === '' || Number(car.price) <= Number(maxPrice)

        const matchesRating = Number(car.rating ?? 0) >= minRating

        return matchesSearch && matchesPrice && matchesRating
    })

    const clearFilters = () => {
        setMaxPrice('')
        setMinRating(0)
        setSearchCars('')
    }

    const hasActiveFilters = maxPrice !== '' || minRating > 0 || searchCars !== ''

    return (
        <div className='min-h-screen bg-gray-50 py-8 px-5'>
            {/* Header */}
            <h1 className='text-2xl font-bold text-gray-800'>Browse Cars</h1>
            <p className='text-gray-500 mt-1'>Find your next ride from our wide range of cars</p>

            {/* Search + Filter Toggle Row */}
            <div className='flex flex-wrap items-center gap-3 mt-5'>
                <input
                    placeholder='Search by name or brand...'
                    value={searchCars}
                    onChange={(e) => setSearchCars(e.target.value)}
                    className='rounded-full border border-gray-300 px-4 py-2 bg-white w-full sm:w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
                />

                <button
                    onClick={() => setShowFilters((prev) => !prev)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium shadow-sm transition-colors ${
                        showFilters
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                >
                    <SlidersHorizontal size={15} />
                    Filters
                    {hasActiveFilters && (
                        <span className='bg-yellow-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>
                            !
                        </span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className='flex items-center gap-1 text-sm text-red-500 hover:text-red-700'
                    >
                        <X size={14} />
                        Clear all
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className='mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-wrap gap-8'>
                    {/* Max Price */}
                    <div className='flex flex-col gap-2 min-w-[200px]'>
                        <label className='text-sm font-semibold text-gray-700'>
                            Max Price per Hour
                            {maxPrice && (
                                <span className='ml-2 text-blue-600 font-bold'>${maxPrice}</span>
                            )}
                        </label>
                        <input
                            type='range'
                            min={0}
                            max={500}
                            step={10}
                            value={maxPrice === '' ? 500 : maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className='accent-blue-600 w-full'
                        />
                        <div className='flex justify-between text-xs text-gray-400'>
                            <span>$0</span>
                            <span>$500</span>
                        </div>
                    </div>

                    {/* Min Rating */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-semibold text-gray-700'>
                            Minimum Rating
                        </label>
                        <div className='flex gap-2'>
                            {[0, 1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setMinRating(star)}
                                    className={`w-9 h-9 rounded-full text-sm font-semibold border transition-colors ${
                                        minRating === star
                                            ? 'bg-yellow-400 text-white border-yellow-400'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-yellow-50'
                                    }`}
                                >
                                    {star === 0 ? 'All' : `${star}★`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Results count */}
            <p className='text-sm text-gray-400 mt-5'>
                Showing <span className='font-semibold text-gray-600'>{filteredCars.length}</span> car{filteredCars.length !== 1 ? 's' : ''}
            </p>

            {/* Car Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3'>
                {filteredCars.length > 0 ? (
                    filteredCars.map((car) => (
                        <CarCard key={car.id} car={car} />
                    ))
                ) : (
                    <div className='col-span-3 flex flex-col items-center justify-center py-20 text-gray-400'>
                        <p className='text-lg font-medium'>No cars match your filters</p>
                        <button
                            onClick={clearFilters}
                            className='mt-3 text-sm text-blue-500 hover:underline'
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BrowseCars
