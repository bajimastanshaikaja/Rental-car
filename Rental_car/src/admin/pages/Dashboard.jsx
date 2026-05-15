import React, { useEffect, useState } from "react";
import { CalendarDays, Car, IndianRupee, TrendingUp, Users, Star, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, PieChart, Pie, LabelList, Cell } from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/DB/FirebaseConfig";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PIE_COLORS = ["#3b82f6", "#22c55e", "#f97316", "#06b6d4", "#a855f7", "#ef4444"];

const STATUS_STYLES = {
    pending:   "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
}

function StatusBadge({ status }) {
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
            {status}
        </span>
    )
}

export const Dashboard = () => {
    const [bookings, setBookings] = useState([])
    const [cars, setCars]         = useState([])
    const [users, setUsers]       = useState([])
    const [loading, setLoading]   = useState(true)
    const [bookingPage, setBookingPage] = useState(1)
    const BOOKINGS_PER_PAGE = 5

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [bookSnap, carSnap, userSnap] = await Promise.all([
                    getDocs(collection(db, "Bookings")),
                    getDocs(collection(db, "Carsdb")),
                    getDocs(collection(db, "users")),
                ])
                setBookings(bookSnap.docs.map(d => ({ id: d.id, ...d.data() })))
                setCars(carSnap.docs.map(d => ({ id: d.id, ...d.data() })))
                setUsers(userSnap.docs.map(d => ({ id: d.id, ...d.data() })))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    // ── Stat calculations ─────────────────────────────────
    const totalRevenue = bookings
        .filter(b => b.status === "completed" || b.status === "confirmed")
        .reduce((sum, b) => sum + Number(b.amount || 0), 0)

    const totalBookings  = bookings.length
    const activeCars     = cars.filter(c => c.availability === "Available").length
    const totalUsers     = users.length

    // ── Line chart — bookings per month (current year) ───
    const currentYear = new Date().getFullYear()
    const bookingsByMonth = Array(12).fill(0)
    bookings.forEach(b => {
        if (!b.createdAt?.seconds) return
        const d = new Date(b.createdAt.seconds * 1000)
        if (d.getFullYear() === currentYear) {
            bookingsByMonth[d.getMonth()]++
        }
    })
    const lineData = MONTHS.map((month, i) => ({ month, bookings: bookingsByMonth[i] }))

    // ── Pie chart — bookings by car type ─────────────────
    const typeCount = {}
    bookings.forEach(b => {
        const t = b.carType || "Other"
        typeCount[t] = (typeCount[t] || 0) + 1
    })
    const pieData = Object.entries(typeCount).map(([name, value]) => ({ name, value }))

    // ── Fleet status ──────────────────────────────────────
    const availableCars  = cars.filter(c => c.availability === "Available").length
    const rentedOutCars  = cars.filter(c => c.availability === "Not Available").length
    const totalFleet     = cars.length

    // ── Recent bookings — all sorted, paginated in JSX ───
    const sortedBookings = [...bookings]
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))

    // ── Rating status — only completed bookings matter ────
    const completedBookings = bookings.filter(b => b.status === "completed")
    const ratedBookings     = completedBookings.filter(b => b.rating)
    const notRatedBookings  = completedBookings.filter(b => !b.rating)

    const STAT_CARDS = [
        {
            icon: <IndianRupee />, bg: "bg-blue-100",
            label: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            trend: null,
        },
        {
            icon: <CalendarDays />, bg: "bg-green-100",
            label: "Total Bookings",
            value: totalBookings,
            trend: null,
        },
        {
            icon: <Car />, bg: "bg-cyan-100",
            label: "Available Cars",
            value: activeCars,
            trend: null,
        },
        {
            icon: <Users />, bg: "bg-orange-100",
            label: "Total Users",
            value: totalUsers,
            trend: null,
        },
    ]

    const chartConfig = { bookings: { label: "Bookings", color: "#3b82f6" } }

    const ChartLineDots = () => (
        <Card>
            <CardHeader>
                <CardTitle>Bookings Over Time</CardTitle>
                <CardDescription>{currentYear} — monthly breakdown</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart data={lineData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line dataKey="bookings" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <TrendingUp className="h-4 w-4 text-green-500" /> Live data from Firestore
                </div>
            </CardFooter>
        </Card>
    )

    const ChartPie = () => (
        <Card>
            <CardHeader>
                <CardTitle>Bookings by Car Type</CardTitle>
                <CardDescription>All time distribution</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}}>
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie data={pieData} dataKey="value" nameKey="name">
                            {pieData.map((_, i) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                            <LabelList dataKey="name" fill="#fff" fontSize={12} />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <TrendingUp className="h-4 w-4 text-green-500" /> Based on {totalBookings} bookings
                </div>
            </CardFooter>
        </Card>
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-400">
                Loading dashboard...
            </div>
        )
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Welcome back! Here's what's happening with your rental business.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STAT_CARDS.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className={`${card.bg} p-3 rounded-full`}>{card.icon}</div>
                            {card.trend && (
                                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                                    <TrendingUp className="size-4" />{card.trend}
                                </div>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm mt-6">{card.label}</p>
                        <p className="font-bold text-2xl mt-1 text-gray-800">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <ChartLineDots />
                <ChartPie />
            </div>

            {/* Recent Bookings + Fleet */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

                {/* Recent Bookings Table — paginated */}
                <div className="bg-white rounded-xl shadow-sm overflow-x-auto lg:col-span-2">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                        <h2 className="font-bold text-gray-800">Recent Bookings</h2>
                        <p className="text-xs text-gray-400">
                            {sortedBookings.length} total
                        </p>
                    </div>
                    <table className="w-full text-left text-sm min-w-[540px]">
                        <thead className="bg-gray-50 border-b text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-5 py-3">Booking ID</th>
                                <th className="px-5 py-3">Customer</th>
                                <th className="px-5 py-3">Car</th>
                                <th className="px-5 py-3">Amount</th>
                                <th className="px-5 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sortedBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-400">
                                        No bookings yet
                                    </td>
                                </tr>
                            ) : (
                                sortedBookings
                                    .slice((bookingPage - 1) * BOOKINGS_PER_PAGE, bookingPage * BOOKINGS_PER_PAGE)
                                    .map((b) => (
                                        <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-semibold text-gray-700">{b.bookingId}</td>
                                            <td className="px-5 py-3">
                                                <p className="font-medium text-gray-800">{b.customerName}</p>
                                                <p className="text-xs text-gray-400">{b.customerEmail}</p>
                                            </td>
                                            <td className="px-5 py-3 text-gray-600">{b.carName}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-0.5 font-semibold text-gray-800">
                                                    <IndianRupee size={13} strokeWidth={2.5} />{b.amount}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <StatusBadge status={b.status} />
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination controls */}
                    {sortedBookings.length > BOOKINGS_PER_PAGE && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                            <p className="text-xs text-gray-400">
                                Showing {(bookingPage - 1) * BOOKINGS_PER_PAGE + 1}–{Math.min(bookingPage * BOOKINGS_PER_PAGE, sortedBookings.length)} of {sortedBookings.length}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setBookingPage(p => Math.max(1, p - 1))}
                                    disabled={bookingPage === 1}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    ← Prev
                                </button>
                                {Array.from({ length: Math.ceil(sortedBookings.length / BOOKINGS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setBookingPage(page)}
                                        className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
                                            bookingPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setBookingPage(p => Math.min(Math.ceil(sortedBookings.length / BOOKINGS_PER_PAGE), p + 1))}
                                    disabled={bookingPage === Math.ceil(sortedBookings.length / BOOKINGS_PER_PAGE)}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fleet Status */}
                <div className="bg-white rounded-xl shadow-sm p-4 h-fit self-start">
                    <h2 className="font-bold text-lg mb-4 text-gray-800">Fleet Status</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl">
                            <div>
                                <p className="text-sm text-gray-500">Available</p>
                                <p className="text-2xl font-bold text-green-600">{availableCars}</p>
                            </div>
                            <Car className="text-green-500" size={28} />
                        </div>
                        <div className="flex justify-between items-center bg-red-50 p-4 rounded-xl">
                            <div>
                                <p className="text-sm text-gray-500">Rented Out</p>
                                <p className="text-2xl font-bold text-red-500">{rentedOutCars}</p>
                            </div>
                            <Car className="text-red-400" size={28} />
                        </div>
                        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl">
                            <div>
                                <p className="text-sm text-gray-500">Total Fleet</p>
                                <p className="text-2xl font-bold text-blue-600">{totalFleet}</p>
                            </div>
                            <Car className="text-blue-500" size={28} />
                        </div>
                    </div>
                </div>

            </div>
            {/* Rating Status Section */}
            <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800 text-lg">Customer Ratings</h2>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            {ratedBookings.length} rated
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-400 font-semibold">
                            <Star size={14} className="text-gray-300" />
                            {notRatedBookings.length} pending
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <RatingTabs
                    ratedBookings={ratedBookings}
                    notRatedBookings={notRatedBookings}
                />
            </div>

        </div>
    )
}

// ── Rating Tabs Component ─────────────────────────────────
function RatingTabs({ ratedBookings, notRatedBookings }) {
    const [tab, setTab] = useState("rated")
    const list = tab === "rated" ? ratedBookings : notRatedBookings

    return (
        <div>
            {/* Tab switcher */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setTab("rated")}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                        tab === "rated"
                            ? "text-green-600 border-b-2 border-green-500 bg-green-50"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    ⭐ Rated ({ratedBookings.length})
                </button>
                <button
                    onClick={() => setTab("pending")}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                        tab === "pending"
                            ? "text-orange-600 border-b-2 border-orange-400 bg-orange-50"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    ⏳ Not Rated ({notRatedBookings.length})
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {list.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Star size={36} className="text-gray-200 mb-2" />
                        <p className="text-sm font-medium">
                            {tab === "rated" ? "No ratings yet" : "All completed trips have been rated!"}
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm min-w-[540px]">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
                            <tr>
                                <th className="px-5 py-3">Customer</th>
                                <th className="px-5 py-3">Car</th>
                                <th className="px-5 py-3">Booking ID</th>
                                {tab === "rated" && <th className="px-5 py-3">Rating</th>}
                                {tab === "rated" && <th className="px-5 py-3">Review</th>}
                                {tab === "pending" && <th className="px-5 py-3">Completed On</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {list.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-gray-800">{b.customerName}</p>
                                        <p className="text-xs text-gray-400">{b.customerEmail}</p>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={b.carImage}
                                                alt={b.carName}
                                                className="w-10 h-7 object-cover rounded"
                                                onError={(e) => { e.target.src = "https://placehold.co/40x28?text=Car" }}
                                            />
                                            <span className="text-gray-700 font-medium">{b.carName}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{b.bookingId}</td>
                                    {tab === "rated" && (
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1">
                                                {[1,2,3,4,5].map(s => (
                                                    <Star key={s} size={13}
                                                        className={s <= b.rating
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-200 fill-gray-200"}
                                                    />
                                                ))}
                                                <span className="text-xs text-gray-500 ml-1">{b.rating}/5</span>
                                            </div>
                                        </td>
                                    )}
                                    {tab === "rated" && (
                                        <td className="px-5 py-3 max-w-xs">
                                            {b.review ? (
                                                <div className="flex items-start gap-1.5">
                                                    <MessageSquare size={13} className="text-blue-400 mt-0.5 flex-shrink-0" />
                                                    <p className="text-xs text-gray-600 italic line-clamp-2">"{b.review}"</p>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-300">No review</span>
                                            )}
                                        </td>
                                    )}
                                    {tab === "pending" && (
                                        <td className="px-5 py-3 text-gray-500 text-xs">
                                            {b.ratedAt ? new Date(b.ratedAt).toLocaleDateString("en-IN") : "—"}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
