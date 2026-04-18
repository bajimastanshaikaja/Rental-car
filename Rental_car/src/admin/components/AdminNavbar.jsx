import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { Dashboard } from '../pages/Dashboard'
import { ManageBookings } from '../pages/ManageBookings'
import { ManageCars } from '../pages/ManageCars'
import Addcars from './Addcars'

export const AdminNavbar = () => {
    return (
        <div className='shadow-lg rounded-4xl sticky-0  max-w-5/6' >
            <BrowserRouter>
                <ul className='flex gap-5 border border-none
             rounded-2xl  '>
                    <li><Link to="/dashboard">dashboard</Link></li>
                    <li><Link to="/managecars">ManageCars</Link></li>
                    <li><Link to="/bookings">ManageBookings</Link></li>
                </ul>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/managecars" element={<ManageCars />} />
                    <Route path="/bookings" element={<ManageBookings />} />

                </Routes>
            </BrowserRouter>
        </div>
    )
}