import React, { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc, orderBy, query, getDoc } from 'firebase/firestore'
import { db } from '@/DB/FirebaseConfig'
import { Eye, XCircle, IndianRupee, Star } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog'

const STATUS_STYLES = {
    pending:   'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
}

function StatusBadge({ status }) {
    return (
        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    )
}

function Detail({ label, value, children }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
            {children ?? <span className="text-gray-800 font-semibold">{value || '—'}</span>}
        </div>
    )
}

function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: '2-digit',
    })
}

function formatDateFull(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('en-IN', {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    })
}

// ── Interactive star picker ───────────────────────────────
function StarPicker({ value, onChange }) {
    const [hovered, setHovered] = useState(0)
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110"
                >
                    <Star
                        size={32}
                        className={
                            star <= (hovered || value)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 fill-gray-200'
                        }
                    />
                </button>
            ))}
        </div>
    )
}

const TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

function Mybookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('all')

    // Detail modal
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [detailOpen, setDetailOpen] = useState(false)

    // Rating modal
    const [ratingBooking, setRatingBooking] = useState(null)
    const [ratingOpen, setRatingOpen] = useState(false)
    const [selectedRating, setSelectedRating] = useState(0)
    const [ratingLoading, setRatingLoading] = useState(false)

    const fetchBookings = async () => {
        setLoading(true)
        try {
            const q = query(collection(db, 'Bookings'), orderBy('createdAt', 'desc'))
            const snap = await getDocs(q)
            setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        } catch (err) {
            console.error(err)
            toast.error('Failed to load bookings')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchBookings() }, [])

    const updateStatus = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, 'Bookings', id), { status: newStatus })
            setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: newStatus } : b))
            toast.success(`Booking ${newStatus}`)
        } catch (err) {
            console.error(err)
            toast.error('Failed to update booking')
        }
    }
    // Submit rating — updates Booking doc + recalculates car's average rating
    const submitRating = async () => {
        if (!selectedRating) { toast.error('Please select a rating'); return }
        setRatingLoading(true)
        try {
            // 1. Save rating on the booking
            await updateDoc(doc(db, 'Bookings', ratingBooking.id), {
                rating: selectedRating,
                ratedAt: new Date().toISOString(),
            })
            // 2. Recalculate average rating on the car
            const carId = ratingBooking.carId
            if (carId) {
                // Get all completed + rated bookings for this car
                const allSnap = await getDocs(collection(db, 'Bookings'))
                const carBookings = allSnap.docs
                    .map(d => d.data())
                    .filter(b => b.carId === carId && b.rating)

                // Include the new rating we just saved
                const ratings = carBookings.map(b => b.rating)
                if (!ratings.includes(selectedRating)) ratings.push(selectedRating)

                const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length

                await updateDoc(doc(db, 'Carsdb', carId), {
                    rating: parseFloat(avg.toFixed(1)),
                })
            }

            // 3. Update local state
            setBookings(prev => prev.map(b =>
                b.id === ratingBooking.id ? { ...b, rating: selectedRating } : b
            ))

            toast.success('Rating submitted!')
            setRatingOpen(false)
            setSelectedRating(0)
        } catch (err) {
            console.error(err)
            toast.error('Failed to submit rating')
        } finally {
            setRatingLoading(false)
        }
    }

    const filtered = activeTab === 'all'
        ? bookings
        : bookings.filter((b) => b.status === activeTab)

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-5">
            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
            <p className="text-gray-500 mt-1">Manage and track all your car rentals</p>

            {/* Tabs */}
            <div className="flex gap-2 mt-6 flex-wrap">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors border ${
                            activeTab === tab
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {tab}
                        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                            activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                            {tab === 'all' ? bookings.length : bookings.filter(b => b.status === tab).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="mt-5 bg-white rounded-2xl shadow-sm overflow-x-auto">
                {loading ? (
                    <div className="flex justify-center items-center py-20 text-gray-400">Loading bookings...</div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p className="text-lg font-medium">No bookings found</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-5 py-4">Booking ID</th>
                                <th className="px-5 py-4">Customer</th>
                                <th className="px-5 py-4">Car</th>
                                <th className="px-5 py-4">Pickup Date</th>
                                <th className="px-5 py-4">Return Date</th>
                                <th className="px-5 py-4">Amount</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4 font-semibold text-gray-700">{booking.bookingId}</td>

                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-gray-800">{booking.customerName}</p>
                                        <p className="text-xs text-gray-400">{booking.customerEmail}</p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={booking.carImage}
                                                alt={booking.carName}
                                                className="w-12 h-9 object-cover rounded-lg"
                                                onError={(e) => { e.target.src = 'https://placehold.co/48x36?text=Car' }}
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{booking.carName}</p>
                                                <p className="text-xs text-gray-400 capitalize">{booking.carType}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-gray-600">{formatDate(booking.pickupDate)}</td>
                                    <td className="px-5 py-4 text-gray-600">{formatDate(booking.returnDate)}</td>

                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-0.5 font-semibold text-gray-800">
                                            <IndianRupee size={13} strokeWidth={2.5} />
                                            {booking.amount}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4"><StatusBadge status={booking.status} /></td>

                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            {/* View */}
                                            <button
                                                title="View Details"
                                                onClick={() => { setSelectedBooking(booking); setDetailOpen(true) }}
                                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            {/* Rate — only completed, not yet rated */}
                                            {booking.status === 'completed' && !booking.rating && (
                                                <button
                                                    title="Rate this car"
                                                    onClick={() => {
                                                        setRatingBooking(booking)
                                                        setSelectedRating(0)
                                                        setRatingOpen(true)
                                                    }}
                                                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                                                >
                                                    <Star size={18} />
                                                </button>
                                            )}

                                            {/* Show submitted rating */}
                                            {booking.status === 'completed' && booking.rating && (
                                                <div className="flex items-center gap-0.5 text-yellow-400">
                                                    <Star size={14} className="fill-yellow-400" />
                                                    <span className="text-xs font-semibold text-gray-600">{booking.rating}</span>
                                                </div>
                                            )}

                                            {/* Cancel */}
                                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                <button
                                                    title="Cancel"
                                                    onClick={() => updateStatus(booking.id, 'cancelled')}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Footer count */}
            {!loading && (
                <p className="text-sm text-gray-400 mt-3">
                    Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{' '}
                    <span className="font-semibold text-gray-600">{bookings.length}</span> bookings
                </p>
            )}

            {/* ── Detail Modal ─────────────────────────────── */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-md bg-white rounded-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Booking Details</DialogTitle>
                        <DialogDescription className="text-gray-400 text-sm">{selectedBooking?.bookingId}</DialogDescription>
                    </DialogHeader>
                    {selectedBooking && (
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <img
                                    src={selectedBooking.carImage}
                                    alt={selectedBooking.carName}
                                    className="w-20 h-14 object-cover rounded-lg"
                                    onError={(e) => { e.target.src = 'https://placehold.co/80x56?text=Car' }}
                                />
                                <div>
                                    <p className="font-bold text-gray-800">{selectedBooking.carName}</p>
                                    <p className="text-sm text-gray-500">{selectedBooking.carBrand} &bull; {selectedBooking.carType}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <Detail label="Customer" value={selectedBooking.customerName} />
                                <Detail label="Email" value={selectedBooking.customerEmail} />
                                <Detail label="Phone" value={selectedBooking.customerPhone} />
                                <Detail label="Status"><StatusBadge status={selectedBooking.status} /></Detail>
                                <Detail label="Pickup" value={formatDateFull(selectedBooking.pickupDate)} />
                                <Detail label="Return" value={formatDateFull(selectedBooking.returnDate)} />
                                <Detail label="Amount">
                                    <div className="flex items-center gap-0.5 font-bold text-blue-600">
                                        <IndianRupee size={13} strokeWidth={2.5} />
                                        {selectedBooking.amount}
                                    </div>
                                </Detail>
                                {selectedBooking.rating && (
                                    <Detail label="Your Rating">
                                        <div className="flex items-center gap-1">
                                            {[1,2,3,4,5].map(s => (
                                                <Star key={s} size={14}
                                                    className={s <= selectedBooking.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                                                />
                                            ))}
                                        </div>
                                    </Detail>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ── Rating Modal ─────────────────────────────── */}
            <Dialog open={ratingOpen} onOpenChange={setRatingOpen}>
                <DialogContent className="max-w-sm bg-white rounded-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Rate Your Experience</DialogTitle>
                        <DialogDescription className="text-gray-400 text-sm">
                            How was your ride in {ratingBooking?.carName}?
                        </DialogDescription>
                    </DialogHeader>

                    {ratingBooking && (
                        <div className="flex flex-col items-center gap-5 mt-2">
                            {/* Car summary */}
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 w-full">
                                <img
                                    src={ratingBooking.carImage}
                                    alt={ratingBooking.carName}
                                    className="w-16 h-11 object-cover rounded-lg"
                                    onError={(e) => { e.target.src = 'https://placehold.co/64x44?text=Car' }}
                                />
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{ratingBooking.carName}</p>
                                    <p className="text-xs text-gray-400">{ratingBooking.carBrand} &bull; {ratingBooking.carType}</p>
                                </div>
                            </div>

                            {/* Star picker */}
                            <StarPicker value={selectedRating} onChange={setSelectedRating} />

                            {/* Label */}
                            <p className="text-sm text-gray-500 h-5">
                                {selectedRating === 1 && 'Poor'}
                                {selectedRating === 2 && 'Fair'}
                                {selectedRating === 3 && 'Good'}
                                {selectedRating === 4 && 'Very Good'}
                                {selectedRating === 5 && 'Excellent!'}
                            </p>

                            <button
                                onClick={submitRating}
                                disabled={!selectedRating || ratingLoading}
                                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {ratingLoading ? 'Submitting...' : 'Submit Rating'}
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Mybookings
