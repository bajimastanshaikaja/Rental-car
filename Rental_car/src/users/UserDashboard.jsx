import React, { useContext, useEffect, useState } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/DB/FirebaseConfig'
import { AuthContext } from '@/main'
import { Link } from 'react-router-dom'
import {
    CalendarDays, Car, CheckCircle, Clock,
    XCircle, IndianRupee, Star, ArrowRight, User
} from 'lucide-react'

const STATUS_STYLES = {
    pending:   { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    confirmed: { bg: 'bg-blue-100',   text: 'text-blue-700'   },
    completed: { bg: 'bg-green-100',  text: 'text-green-700'  },
    cancelled: { bg: 'bg-red-100',    text: 'text-red-600'    },
}

function StatusBadge({ status }) {
    const s = STATUS_STYLES[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${s.bg} ${s.text}`}>
            {status}
        </span>
    )
}

function StatCard({ icon, label, value, bg }) {
    return (
        <div className="bg-white rounded-2xl p-5 h-45 shadow-sm flex items-center gap-4">
            <div className={`${bg} p-3 rounded-xl`}>{icon}</div>
            <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    )
}

function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
}

export default function UserDashboard() {
    const { currentUser } = useContext(AuthContext)
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch bookings for this user by email
    useEffect(() => {
        if (!currentUser?.email) return
        const fetch = async () => {
            setLoading(true)
            try {
                const q = query(
                    collection(db, 'Bookings'),
                    where('customerEmail', '==', currentUser.email),
                    orderBy('createdAt', 'desc')
                )
                const snap = await getDocs(q)
                setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [currentUser])

    // Derived stats
    const total     = bookings.length
    const active    = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length
    const completed = bookings.filter(b => b.status === 'completed').length
    const cancelled = bookings.filter(b => b.status === 'cancelled').length
    const totalSpent = bookings
        .filter(b => b.status !== 'cancelled')
        .reduce((sum, b) => sum + Number(b.amount || 0), 0)

    const recent = bookings.slice(0, 5)

    const displayName = currentUser?.name || currentUser?.email?.split('@')[0] || 'User'
    const initials = displayName.slice(0, 2).toUpperCase()

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">

            {/* ── Welcome Banner ───────────────────────────── */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {initials}
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm">Welcome back,</p>
                        <h1 className="text-2xl font-bold text-white capitalize">{displayName}</h1>
                        <p className="text-blue-200 text-sm mt-0.5">{currentUser?.email}</p>
                    </div>
                </div>
                <Link
                    to="/browsecars"
                    className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
                >
                    Browse Cars <ArrowRight size={16} />
                </Link>
            </div>

            {/* ── Stat Cards ───────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
                <StatCard
                    icon={<CalendarDays size={22} className="text-blue-600 " />}
                    label="Total Bookings"
                    value={total}
                    bg="bg-blue-50"
                />
                <StatCard
                    icon={<Clock size={22} className="text-yellow-600" />}
                    label="Active Bookings"
                    value={active}
                    bg="bg-yellow-50"
                />
                <StatCard
                    icon={<CheckCircle size={22} className="text-green-600" />}
                    label="Completed"
                    value={completed}
                    bg="bg-green-50"
                />
                <StatCard
                    icon={<IndianRupee size={22} className="text-purple-600" />}
                    label="Total Spent"
                    value={`₹${totalSpent.toLocaleString('en-IN')}`}
                    bg="bg-purple-50"
                />
            </div>

            {/* ── Recent Bookings ──────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800 text-lg">Recent Bookings</h2>
                    <Link
                        to="/mybookings"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                        View all <ArrowRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16 text-gray-400">
                        Loading...
                    </div>
                ) : recent.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                        <Car size={40} className="text-gray-300" />
                        <p className="font-medium">No bookings yet</p>
                        <Link
                            to="/browsecars"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Book your first car →
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[540px]">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-3 text-left">Car</th>
                                    <th className="px-5 py-3 text-left">Pickup</th>
                                    <th className="px-5 py-3 text-left">Return</th>
                                    <th className="px-5 py-3 text-left">Amount</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                    {/* Rating column */}
                                    <th className="px-5 py-3 text-left">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recent.map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={b.carImage}
                                                    alt={b.carName}
                                                    className="w-12 h-9 object-cover rounded-lg flex-shrink-0"
                                                    onError={(e) => { e.target.src = 'https://placehold.co/48x36?text=Car' }}
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-800">{b.carName}</p>
                                                    <p className="text-xs text-gray-400 capitalize">{b.carType}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">{formatDate(b.pickupDate)}</td>
                                        <td className="px-5 py-3 text-gray-600">{formatDate(b.returnDate)}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-0.5 font-semibold text-gray-800">
                                                <IndianRupee size={13} strokeWidth={2.5} />
                                                {b.amount}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <StatusBadge status={b.status} />
                                        </td>
                                        <td className="px-5 py-3">
                                            {b.rating ? (
                                                <div className="flex items-center gap-1">
                                                    {[1,2,3,4,5].map(s => (
                                                        <Star key={s} size={13}
                                                            className={s <= b.rating
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-200 fill-gray-200'}
                                                        />
                                                    ))}
                                                </div>
                                            ) : b.status === 'completed' ? (
                                                <Link to="/mybookings" className="text-xs text-blue-500 hover:underline">
                                                    Rate now
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-gray-300">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Quick Actions ────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <Link
                    to="/browsecars"
                    className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group"
                >
                    <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                        <Car size={22} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">Browse Cars</p>
                        <p className="text-xs text-gray-400">Find your next ride</p>
                    </div>
                    <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-blue-500 transition-colors" />
                </Link>

                <Link
                    to="/mybookings"
                    className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group"
                >
                    <div className="bg-green-50 p-3 rounded-xl group-hover:bg-green-100 transition-colors">
                        <CalendarDays size={22} className="text-green-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">My Bookings</p>
                        <p className="text-xs text-gray-400">View all your rentals</p>
                    </div>
                    <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-green-500 transition-colors" />
                </Link>

                <Link
                    to="/mybookings?tab=completed"
                    className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group"
                >
                    <div className="bg-yellow-50 p-3 rounded-xl group-hover:bg-yellow-100 transition-colors">
                        <Star size={22} className="text-yellow-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">Rate a Car</p>
                        <p className="text-xs text-gray-400">Share your experience</p>
                    </div>
                    <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-yellow-500 transition-colors" />
                </Link>
            </div>

        </div>
    )
}
