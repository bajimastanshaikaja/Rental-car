import React, { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/DB/FirebaseConfig'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { IndianRupee, X } from 'lucide-react'
import { toast } from 'sonner'

function BookingModal({ open, setOpen, car }) {
    const [form, setForm] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        pickupDate: '',
        returnDate: '',
    })
    const [loading, setLoading] = useState(false)

    if (!car) return null

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // Calculate total amount based on hours between dates
    const calcAmount = () => {
        if (!form.pickupDate || !form.returnDate) return 0
        const pickup = new Date(form.pickupDate)
        const returnD = new Date(form.returnDate)
        const diffMs = returnD - pickup
        if (diffMs <= 0) return 0
        const diffHours = diffMs / (1000 * 60 * 60)
        return Math.round(diffHours * Number(car.price))
    }

    const amount = calcAmount()

    // Generate a short booking ID
    const generateBookingId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let id = 'B'
        for (let i = 0; i < 5; i++) id += chars[Math.floor(Math.random() * chars.length)]
        return id
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (amount <= 0) {
            toast.error('Return date must be after pickup date')
            return
        }
        setLoading(true)
        try {
            await addDoc(collection(db, 'Bookings'), {
                bookingId: generateBookingId(),
                customerName: form.customerName,
                customerEmail: form.customerEmail,
                customerPhone: form.customerPhone,
                carId: car.id,
                carName: car.carName,
                carBrand: car.brand,
                carType: car.type,
                carImage: car.image,
                pickupDate: form.pickupDate,
                returnDate: form.returnDate,
                amount,
                status: 'pending',
                createdAt: serverTimestamp(),
            })
            toast.success('Booking confirmed!')
            setOpen(false)
            setForm({ customerName: '', customerEmail: '', customerPhone: '', pickupDate: '', returnDate: '' })
        } catch (err) {
            console.error(err)
            toast.error('Booking failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg bg-white rounded-2xl shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Book Car</DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Fill in your details to confirm the booking
                    </DialogDescription>
                </DialogHeader>

                {/* Car Summary */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mt-1">
                    <img
                        src={car.image}
                        alt={car.carName}
                        className="w-20 h-14 object-cover rounded-lg"
                        onError={(e) => { e.target.src = 'https://placehold.co/80x56?text=Car' }}
                    />
                    <div>
                        <p className="font-bold text-gray-800">{car.carName}</p>
                        <p className="text-sm text-gray-500">{car.brand} &bull; {car.type}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                            <IndianRupee size={13} className="text-blue-600" strokeWidth={2.5} />
                            <span className="text-sm font-semibold text-blue-600">{car.price}</span>
                            <span className="text-xs text-gray-400 ml-1">/ hour</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <input
                                name="customerName"
                                value={form.customerName}
                                onChange={handleChange}
                                required
                                placeholder="John Smith"
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Phone</label>
                            <input
                                name="customerPhone"
                                value={form.customerPhone}
                                onChange={handleChange}
                                required
                                placeholder="+91 9999999999"
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <input
                            name="customerEmail"
                            type="email"
                            value={form.customerEmail}
                            onChange={handleChange}
                            required
                            placeholder="john@email.com"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Pickup Date & Time</label>
                            <input
                                name="pickupDate"
                                type="datetime-local"
                                value={form.pickupDate}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Return Date & Time</label>
                            <input
                                name="returnDate"
                                type="datetime-local"
                                value={form.returnDate}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                    </div>

                    {/* Amount Preview */}
                    {amount > 0 && (
                        <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                            <span className="text-sm text-gray-600 font-medium">Total Amount</span>
                            <div className="flex items-center gap-0.5">
                                <IndianRupee size={16} className="text-blue-700" strokeWidth={2.5} />
                                <span className="text-lg font-bold text-blue-700">{amount}</span>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 mt-1"
                    >
                        {loading ? 'Confirming...' : 'Confirm Booking'}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default BookingModal
