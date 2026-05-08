import React, { useEffect, useState } from "react";
import { CalendarDays, Car, IndianRupee, TrendingUp, Users } from "lucide-react";
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

    // ── Recent bookings (last 5) ──────────────────────────
    const recentBookings = [...bookings]
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
        .slice(0, 5)

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

                {/* Recent Bookings Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-x-auto lg:col-span-2">
                    <h2 className="font-bold p-4 text-gray-800">Recent Bookings</h2>
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
                            {recentBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-400">
                                        No bookings yet
                                    </td>
                                </tr>
                            ) : (
                                recentBookings.map((b) => (
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
        </div>
    )
}
