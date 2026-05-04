import React, { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore'
import { db } from '@/DB/FirebaseConfig'
import { Eye, CheckCircle, XCircle, IndianRupee } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog'

const STATUS_STYLES = {
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

// ❌ Removed pending
const TABS = ['all', 'confirmed', 'completed', 'cancelled']

export default function ManageBookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('all')
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [search, setSearch] = useState('')

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

            const booking = bookings.find(b => b.id === id)
            if (booking?.carId && (newStatus === 'completed' || newStatus === 'cancelled')) {
                await updateDoc(doc(db, 'Carsdb', booking.carId), { availability: 'Available' })
            }

            setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: newStatus } : b))
            toast.success(`Booking marked as ${newStatus}`)
        } catch (err) {
            console.error(err)
            toast.error('Failed to update status')
        }
    }

    const filtered = bookings
        .filter((b) => activeTab === 'all' || b.status === activeTab)
        .filter((b) =>
            !search ||
            b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            b.carName?.toLowerCase().includes(search.toLowerCase()) ||
            b.bookingId?.toLowerCase().includes(search.toLowerCase())
        )

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-5">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
                    <p className="text-gray-500 mt-1">View and manage all customer bookings</p>
                </div>
                
            </div>
            <div className='mt-4'>
                <input
                    placeholder="Search by customer, car or booking ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-full px-4 py-2 text-sm bg-white w-full sm:w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                </div>

            {/* ✅ NEW TABS UI */}
            <div className="flex gap-3 mt-6 flex-wrap bg-gray-100 p-2 rounded-full">
                {TABS.map((tab) => {
                    const count = tab === 'all'
                        ? bookings.length
                        : bookings.filter(b => b.status === tab).length

                    const isActive = activeTab === tab

                    const badgeColors = {
                        confirmed: 'bg-blue-500 text-white',
                        completed: 'bg-green-500 text-white',
                        cancelled: 'bg-red-500 text-white',
                        all: 'bg-gray-400 text-white',
                    }

                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-gray-100 text-black shadow-md'
                                    : 'bg-white text-white-600 hover:bg-white hover:text-black'
                            }`}
                        >
                            {tab === 'confirmed' ? 'confirmed' : tab}

                            <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColors[tab]}`}>
                                {count}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* TABLE (unchanged) */}
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
                                <th className="px-5 py-4">Pickup</th>
                                <th className="px-5 py-4">Return</th>
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
                                    <td className="px-5 py-4">{booking.carName}</td>
                                    <td className="px-5 py-4">{formatDate(booking.pickupDate)}</td>
                                    <td className="px-5 py-4">{formatDate(booking.returnDate)}</td>
                                    <td className="px-5 py-4 flex items-center gap-1 font-semibold">
                                        <IndianRupee size={13} /> {booking.amount}
                                    </td>
                                    <td className="px-5 py-4"><StatusBadge status={booking.status} /></td>
                                    <td className="px-5 py-4 flex justify-center gap-3">
                                        <Eye size={18} className="cursor-pointer text-gray-500 hover:text-blue-600" />
                                        {booking.status === 'confirmed' && (
                                            <CheckCircle size={18} onClick={() => updateStatus(booking.id, 'completed')} className="cursor-pointer text-gray-400 hover:text-green-600" />
                                        )}
                                        {(booking.status === 'confirmed') && (
                                            <XCircle size={18} onClick={() => updateStatus(booking.id, 'cancelled')} className="cursor-pointer text-gray-400 hover:text-red-500" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}