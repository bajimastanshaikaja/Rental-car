import React, { useState, useContext } from 'react'
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/DB/FirebaseConfig'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { IndianRupee } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '@/main'

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID


const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (document.getElementById('razorpay-script')) {
            resolve(true)
            return
        }
        const script = document.createElement('script')
        script.id = 'razorpay-script'
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })

loadRazorpayScript()

function BookingModal({ open, setOpen, car }) {
    const navigate = useNavigate()
    const { currentUser } = useContext(AuthContext)
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

    const saveBooking = async (paymentId) => {
        const bookingId = generateBookingId()
        await addDoc(collection(db, 'Bookings'), {
            bookingId,
            userId: currentUser?.uid || null,   // ← logged-in user's UID
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
            paymentId,
            status: 'confirmed',
            createdAt: serverTimestamp(),
        })
        await updateDoc(doc(db, 'Carsdb', car.id), { availability: 'Not Available' })
        return bookingId
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (amount <= 0) {
            toast.error('Return date must be after pickup date')
            return
        }

        setLoading(true)

        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
            toast.error('Failed to load payment gateway. Check your internet connection.')
            setLoading(false)
            return
        }

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: amount * 100, 
            currency: 'INR',
            name: 'CarRental',
            description: `Booking: ${car.carName} (${car.brand})`,
            image: car.image || '',
            prefill: {
                name: form.customerName,
                email: form.customerEmail,
                contact: form.customerPhone,
            },
            notes: {
                carName: car.carName,
                pickupDate: form.pickupDate,
                returnDate: form.returnDate,
            },
            config: {
                display: {
                    blocks: {
                        netbanking: { name: 'Recommended', instruments: [{ method: 'netbanking' }] },
                        other: { name: 'Other Methods', instruments: [{ method: 'card' }, { method: 'upi' }] },
                    },
                    sequence: ['block.netbanking', 'block.other'],
                    preferences: { show_default_blocks: false },
                },
            },
            theme: {
                color: '#2563EB',
            },
            handler: async (response) => {
                try {
                    await saveBooking(response.razorpay_payment_id)
                    toast.success('Payment successful! Booking confirmed.')
                    setOpen(false)
                    setForm({ customerName: '', customerEmail: '', customerPhone: '', pickupDate: '', returnDate: '' })
                    navigate('/mybookings')
                } catch (err) {
                    console.error(err)
                    toast.error('Payment done but booking save failed. Contact support.')
                } finally {
                    setLoading(false)
                }
            },
            modal: {
                ondismiss: () => {
                    toast.info('Payment cancelled.')
                    setLoading(false)
                },
            },
        }

        const rzp = new window.Razorpay(options)

        rzp.on('payment.failed', (response) => {
            console.error(response.error)
            toast.error(`Payment failed: ${response.error.description}`)
            setLoading(false)
        })

        rzp.open()
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
                                placeholder="Your name"
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
                            placeholder="abc@email.com"
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
                        className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 mt-1 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Opening Payment...
                            </>
                        ) : (
                            <>
                                <IndianRupee size={16} />
                                Pay & Confirm Booking
                            </>
                        )}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default BookingModal
