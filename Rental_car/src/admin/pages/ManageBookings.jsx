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

const TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

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
                <input
                    placeholder="Search by customer, car or booking ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-full px-4 py-2 text-sm bg-white w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>

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
                                            <button
                                                title="View Details"
                                                onClick={() => { setSelectedBooking(booking); setDetailOpen(true) }}
                                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {booking.status === 'pending' && (
                                                <button
                                                    title="Confirm"
                                                    onClick={() => updateStatus(booking.id, 'confirmed')}
                                                    className="text-gray-400 hover:text-green-600 transition-colors"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    title="Mark Completed"
                                                    onClick={() => updateStatus(booking.id, 'completed')}
                                                    className="text-gray-400 hover:text-green-600 transition-colors"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
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

            {/* Detail Modal */}
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
                            <div className="grid grid-cols-2 gap-3 text-sm">
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
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
