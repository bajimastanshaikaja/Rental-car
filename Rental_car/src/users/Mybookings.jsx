import React, { useEffect, useState, useContext, useRef } from 'react'
import { collection, query, where, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore'
import { db } from '@/DB/FirebaseConfig'
import { IndianRupee, Star, XCircle, CalendarDays, ChevronDown, ChevronUp, Car, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { AuthContext } from '@/main'
import { Link, useLocation } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

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

function StarPicker({ value, onChange }) {
    const [hovered, setHovered] = useState(0)
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110"
                >
                    <Star size={30} className={
                        star <= (hovered || value)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 fill-gray-200'
                    } />
                </button>
            ))}
        </div>
    )
}

function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toISOString().split('T')[0]
}

// ── Single Booking Row Card ───────────────────────────────
function BookingCard({ booking, onCancel, onRate, highlighted, cardRef }) {
    const [expanded, setExpanded] = useState(false)
    const isActive    = booking.status === 'pending' || booking.status === 'confirmed'
    const isCompleted = booking.status === 'completed'

    return (
        <div ref={cardRef} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
            highlighted ? 'border-blue-400 ring-2 ring-blue-300' :
            booking.status === 'confirmed' ? 'border-blue-300' : 'border-gray-100'
        }`}>
            {booking.status === 'confirmed' && (
                <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Ride Confirmed — Your booking has been accepted
                </div>
            )}
            {booking.status === 'pending' && (
                <div className="bg-yellow-50 text-yellow-700 text-xs font-semibold px-4 py-1.5 flex items-center gap-2 border-b border-yellow-100">
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    Awaiting confirmation from admin
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 p-4">
                <img
                    src={booking.carImage}
                    alt={booking.carName}
                    className="w-full sm:w-44 h-32 sm:h-28 object-cover rounded-xl flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/176x112?text=Car' }}
                />
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="font-bold text-gray-800 text-base leading-tight">{booking.carName}</h3>
                            <p className="text-sm text-gray-400">{booking.carBrand} &bull; {booking.carType}</p>
                        </div>
                        <StatusBadge status={booking.status} />
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <CalendarDays size={15} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">Pickup</p>
                                <p className="font-semibold text-gray-700">{formatDate(booking.pickupDate)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays size={15} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">Return</p>
                                <p className="font-semibold text-gray-700">{formatDate(booking.returnDate)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1 text-gray-700">
                            <IndianRupee size={15} className="text-gray-500" strokeWidth={2} />
                            <span className="font-bold text-lg text-gray-800">{booking.amount}</span>
                        </div>
                        <button
                            onClick={() => setExpanded(p => !p)}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium"
                        >
                            More Details
                            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 flex flex-col gap-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Booking ID</p>
                            <p className="font-semibold text-gray-700">{booking.bookingId}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Customer</p>
                            <p className="font-semibold text-gray-700">{booking.customerName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Phone</p>
                            <p className="font-semibold text-gray-700">{booking.customerPhone || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                            <p className="font-semibold text-gray-700 truncate">{booking.customerEmail}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Car Type</p>
                            <p className="font-semibold text-gray-700 capitalize">{booking.carType}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Status</p>
                            <StatusBadge status={booking.status} />
                        </div>
                    </div>

                    {/* Show submitted rating + review */}
                    {isCompleted && booking.rating && (
                        <div className="bg-white rounded-xl p-3 border border-gray-100">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Your Review</p>
                            <div className="flex items-center gap-1 mb-1">
                                {[1,2,3,4,5].map(s => (
                                    <Star key={s} size={14}
                                        className={s <= booking.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                                    />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">{booking.rating}/5</span>
                            </div>
                            {booking.review && (
                                <p className="text-sm text-gray-600 italic">"{booking.review}"</p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                        {isActive && (
                            <button
                                onClick={() => onCancel(booking.id)}
                                className="flex items-center gap-1.5 text-sm font-medium text-red-500 border border-red-200 rounded-lg px-4 py-1.5 hover:bg-red-50 transition-colors"
                            >
                                <XCircle size={15} /> Cancel Booking
                            </button>
                        )}
                        {isCompleted && !booking.rating && (
                            <button
                                onClick={() => onRate(booking)}
                                className="flex items-center gap-1.5 text-sm font-medium text-yellow-600 border border-yellow-200 rounded-lg px-4 py-1.5 hover:bg-yellow-50 transition-colors"
                            >
                                <Star size={15} /> Rate &amp; Review
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

function TabBtn({ label, count, active, color, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all ${
                active ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            {label}
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${color}`}>
                {count}
            </span>
        </button>
    )
}

export default function Mybookings() {
    const { currentUser } = useContext(AuthContext)
    const location = useLocation()
    const highlightRef = useRef(null)
    const [bookings, setBookings]         = useState([])
    const [loading, setLoading]           = useState(true)
    const [activeTab, setActiveTab]       = useState('active')
    const [highlightId, setHighlightId]   = useState(null)
    const [ratingBooking, setRatingBooking] = useState(null)
    const [ratingOpen, setRatingOpen]     = useState(false)
    const [selectedRating, setSelectedRating] = useState(0)
    const [reviewText, setReviewText]     = useState('')
    const [ratingLoading, setRatingLoading] = useState(false)

    useEffect(() => {
        if (location.state?.tab === 'completed') {
            setActiveTab('completed')
            if (location.state?.bookingId) setHighlightId(location.state.bookingId)
        }
    }, [location.state])

    useEffect(() => {
        if (highlightId && highlightRef.current) {
            setTimeout(() => {
                highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 300)
        }
    }, [highlightId, bookings])

    useEffect(() => {
        if (!currentUser?.uid && !currentUser?.email) return
        setLoading(true)

        const uid   = currentUser?.uid
        const email = currentUser?.email

        const qByUid   = uid   ? query(collection(db, 'Bookings'), where('userId', '==', uid))   : null
        const qByEmail = email ? query(collection(db, 'Bookings'), where('customerEmail', '==', email)) : null

        const merge = (snapA, snapB) => {
            const map = new Map()
            ;[...(snapA?.docs ?? []), ...(snapB?.docs ?? [])].forEach(d => map.set(d.id, { id: d.id, ...d.data() }))
            return [...map.values()].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
        }

        let snapUid = null, snapEmail = null
        const unsubs = []

        if (qByUid) {
            unsubs.push(onSnapshot(qByUid, (snap) => {
                snapUid = snap
                setBookings(merge(snapUid, snapEmail))
                setLoading(false)
            }, (err) => { console.error(err); setLoading(false) }))
        }

        if (qByEmail) {
            unsubs.push(onSnapshot(qByEmail, (snap) => {
                snapEmail = snap
                setBookings(merge(snapUid, snapEmail))
                setLoading(false)
            }, (err) => { console.error(err); setLoading(false) }))
        }

        return () => unsubs.forEach(u => u())
    }, [currentUser])

    const handleCancel = async (id) => {
        try {
            await updateDoc(doc(db, 'Bookings', id), { status: 'cancelled' })
            const booking = bookings.find(b => b.id === id)
            if (booking?.carId) {
                await updateDoc(doc(db, 'Carsdb', booking.carId), { availability: 'Available' })
            }
            toast.success('Booking cancelled')
        } catch (err) {
            console.error(err)
            toast.error('Failed to cancel booking')
        }
    }

    const submitRating = async () => {
        if (!selectedRating) { toast.error('Please select a rating'); return }
        setRatingLoading(true)
        try {
            // Save rating + review on the booking
            await updateDoc(doc(db, 'Bookings', ratingBooking.id), {
                rating:   selectedRating,
                review:   reviewText.trim(),
                ratedAt:  new Date().toISOString(),
            })

            // Recalculate car average rating + count
            const carId = ratingBooking.carId
            if (carId) {
                const allSnap = await getDocs(collection(db, 'Bookings'))
                const ratedBookings = allSnap.docs
                    .map(d => d.data())
                    .filter(b => b.carId === carId && b.rating)
                const ratings = ratedBookings.map(b => b.rating)
                // include the new rating if not already saved
                if (!ratings.includes(selectedRating)) ratings.push(selectedRating)
                const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length
                await updateDoc(doc(db, 'Carsdb', carId), {
                    rating:      parseFloat(avg.toFixed(1)),
                    ratingCount: ratings.length,
                })
            }

            toast.success('Rating & review submitted!')
            setRatingOpen(false)
            setSelectedRating(0)
            setReviewText('')
        } catch (err) {
            console.error(err)
            toast.error('Failed to submit rating')
        } finally {
            setRatingLoading(false)
        }
    }

    const active    = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed')
    const completed = bookings.filter(b => b.status === 'completed')
    const cancelled = bookings.filter(b => b.status === 'cancelled')
    const filtered  = ({ active, completed, cancelled })[activeTab] ?? []

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
            <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
            <p className="text-gray-500 mt-1">Manage and track all your car rentals</p>

            <div className="mt-6 bg-gray-100 rounded-full p-1 flex gap-1">
                <TabBtn label="Active"    count={active.length}    color="bg-blue-500"  active={activeTab === 'active'}    onClick={() => setActiveTab('active')} />
                <TabBtn label="Completed" count={completed.length} color="bg-green-500" active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} />
                <TabBtn label="Cancelled" count={cancelled.length} color="bg-red-500"   active={activeTab === 'cancelled'} onClick={() => setActiveTab('cancelled')} />
            </div>

            {activeTab === 'active' && active.length > 0 && (
                <p className="text-xs text-gray-400 mt-2 ml-1">
                    Includes <span className="font-semibold text-yellow-600">pending</span> and <span className="font-semibold text-blue-600">confirmed</span> bookings
                </p>
            )}

            <div className="mt-6 flex flex-col gap-4">
                {loading ? (
                    <div className="flex justify-center items-center py-24 text-gray-400">Loading your bookings...</div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
                        <Car size={48} className="text-gray-300" />
                        <p className="text-lg font-medium">No {activeTab} bookings</p>
                        {activeTab === 'active' && (
                            <Link to="/browsecars" className="text-sm text-blue-500 hover:underline">
                                Browse cars to make a booking →
                            </Link>
                        )}
                    </div>
                ) : (
                    filtered.map(booking => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            highlighted={booking.id === highlightId}
                            cardRef={booking.id === highlightId ? highlightRef : null}
                            onCancel={handleCancel}
                            onRate={(b) => { setRatingBooking(b); setSelectedRating(0); setReviewText(''); setRatingOpen(true) }}
                        />
                    ))
                )}
            </div>

            {/* ── Rating + Review Modal ─────────────────────── */}
            <Dialog open={ratingOpen} onOpenChange={setRatingOpen}>
                <DialogContent className="max-w-md bg-white rounded-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Rate &amp; Review</DialogTitle>
                        <DialogDescription className="text-gray-400 text-sm">
                            Share your experience with {ratingBooking?.carName}
                        </DialogDescription>
                    </DialogHeader>

                    {ratingBooking && (
                        <div className="flex flex-col gap-4 mt-2">
                            {/* Car summary */}
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <img src={ratingBooking.carImage} alt={ratingBooking.carName}
                                    className="w-16 h-11 object-cover rounded-lg"
                                    onError={(e) => { e.target.src = 'https://placehold.co/64x44?text=Car' }}
                                />
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{ratingBooking.carName}</p>
                                    <p className="text-xs text-gray-400">{ratingBooking.carBrand} &bull; {ratingBooking.carType}</p>
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="flex flex-col items-center gap-2">
                                <StarPicker value={selectedRating} onChange={setSelectedRating} />
                                <p className="text-sm text-gray-500 h-5">
                                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][selectedRating]}
                                </p>
                            </div>

                            {/* Review text */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                    <MessageSquare size={14} className="text-blue-500" />
                                    Write a Review
                                    <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Tell others about your experience — was the car clean? Was the ride smooth? Would you recommend it?"
                                    rows={3}
                                    maxLength={300}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                                />
                                <p className="text-xs text-gray-400 text-right">{reviewText.length}/300</p>
                            </div>

                            <button
                                onClick={submitRating}
                                disabled={!selectedRating || ratingLoading}
                                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {ratingLoading ? 'Submitting...' : 'Submit Rating & Review'}
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
