import React, { useEffect, useState } from "react";
import { CalendarDays, Car, IndianRupee, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { CartesianGrid, Line, LineChart, XAxis, PieChart, Pie, LabelList, Cell } from "recharts";

import { collection, getDocs } from "firebase/firestore"; 
import { db } from "@/DB/FirebaseConfig";
export const Dashboard = () => {
  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
const [bookings, setBookings] = useState([]);
  const chartConfig = { desktop: { label: "Desktop", color: "var(--chart-1)" } };

  const pieData = [
    { browser: "SUV",  visitors: 275, fill: "#3b82f6" },
    { browser: "Compact",  visitors: 200, fill: "#22c55e" },
    { browser: "Sedan", visitors: 187, fill: "#f97316" },
    { browser: "EV",    visitors: 173, fill: "#06b6d4" },
    { browser: "Sports",   visitors: 90,  fill: "#a855f7" },
  ];
  {/* ✅ CALCULATIONS (add just above return OR before JSX) */}
const totalFleet = bookings.length;

// consider active bookings (adjust status if needed)
const rentedOut = bookings.filter(
  (b) => b.status === "Booked" || b.status === "Confirmed"
).length;

const available = totalFleet - rentedOut;
  const STAT_CARDS = [
    { icon: <IndianRupee />, bg: "bg-blue-100",   label: "Total Revenue",  value: "₹1,00,000", trend: "12.5%" },
    { icon: <CalendarDays />, bg: "bg-green-100", label: "Total Bookings", value: "100",        trend: "12.5%" },
    { icon: <Car />,          bg: "bg-cyan-100",  label: "Active Cars",    value: "10" },
    { icon: <Users />,        bg: "bg-orange-100",label: "Total Users",    value: "20" },
  ];
  useEffect(() => {
  const fetchBookings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Bookings")); 
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchBookings();
}, []);
  const COLORS = [
  "#C87740",
  "#00A19B",
  "#8B004A",
  "#6BBF59",
  "#58C5FE",
];

  const ChartLineDots = () => (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Over Time</CardTitle>
        <CardDescription>January – June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickFormatter={(v) => v.slice(0, 3)} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="desktop" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="h-4 w-4 text-green-500" /> Trending up this month
        </div>
      </CardFooter>
    </Card>
  );

  const ChartPie = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings by Car Type</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={{}}>
          <PieChart width={300} height={300}>
            <ChartTooltip content={<ChartTooltipContent />} />

            <Pie data={pieData} dataKey="visitors" nameKey="browser">
  
  {pieData.map((entry, index) => (
    <Cell 
      key={`cell-${index}`} 
      fill={COLORS[index % COLORS.length]} 
    />
  ))}

  <LabelList dataKey="browser" fill="#ffffff" />
</Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex items-center gap-2 text-sm">
          Trending <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
};
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Welcome back! Here's what's happening with your rental business.
        </p>
      </div>

      {/* Stat Cards — 1 col mobile → 2 col tablet → 4 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`${card.bg} p-3 rounded-full`}>
                {card.icon}
              </div>
              {card.trend && (
                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <TrendingUp className="size-4" />
                  {card.trend}
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-6">{card.label}</p>
            <p className="font-bold text-2xl mt-1 text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts — 1 col mobile → 2 col desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 h-130">
        <ChartLineDots />
        <ChartPie />
      </div>
      <div className="flex">
  <div className="bg-white w-230 mt-3 rounded-lg shadow-sm overflow-x-auto h-60">

    <h2 className="font-bold p-3">Recent Bookings</h2>

    <table className="w-full text-left text-sm border-collapse rounded-2xl">

      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wide mt-6">
        <tr>
          <th className="px-5 py-3">Booking Id</th>
          <th className="px-5 py-3">Car</th>
          <th className="px-5 py-3">Dates</th>
          <th className="px-5 py-3">Amount</th>
          <th className="px-5 py-3">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {bookings.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center py-4 text-gray-400">
              No bookings found
            </td>
          </tr>
        ) : (
          bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">

              <td className="px-5 py-3 text-gray-700">
                {booking.bookingId}
              </td>

              <td className="px-5 py-3 text-gray-800">
                {booking.carName}
              </td>

              <td className="px-5 py-3 text-gray-600">
                {booking.pickupDate}
              </td>

              <td className="px-5 py-3 text-gray-800">
                {booking.amount}
              </td>

              <td className="px-5 py-3">
                {booking.status}
              </td>

            </tr>
          ))
        )}
      </tbody>

    </table>
  </div>
  <div className="bg-white ml-15 mt-4 w-80 h-90 rounded-xl shadow-sm p-4">
  <h1 className="font-bold text-lg mb-4">Fleet Status</h1>

  {/* Available */}
  <div className="flex items-center justify-between bg-green-100 p-3 rounded-xl mb-3 mt-4">
    <div>
      <p className="text-gray-600 text-sm">Available</p>
      <h2 className="text-xl font-bold text-green-600">{available}</h2>
    </div>
    <Car className="text-green-600" />
  </div>

  {/* Rented */}
  <div className="flex items-center justify-between bg-red-100 p-3 rounded-xl mb-3">
    <div>
      <p className="text-gray-600 text-sm">Rented Out</p>
      <h2 className="text-xl font-bold text-red-600">{rentedOut}</h2>
    </div>
    <Car className="text-red-600" />
  </div>

  {/* Total */}
  <div className="flex items-center justify-between bg-blue-100 p-3 rounded-xl">
    <div>
      <p className="text-gray-600 text-sm">Total Fleet</p>
      <h2 className="text-xl font-bold text-blue-600">{totalFleet}</h2>
    </div>
    <Car className="text-blue-600" />
  </div>
</div>
</div>

    </div>
  );
};
