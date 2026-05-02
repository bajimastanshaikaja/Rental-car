import React from "react";
import { CalendarDays, Car, IndianRupee, TrendingUp, Users } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, PieChart, Pie, LabelList } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const Dashboard = () => {

  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];

  const chartConfig = { desktop: { label: "Desktop", color: "var(--chart-1)" } };

  const pieData = [
    { browser: "Chrome",  visitors: 275, fill: "#3b82f6" },
    { browser: "Safari",  visitors: 200, fill: "#22c55e" },
    { browser: "Firefox", visitors: 187, fill: "#f97316" },
    { browser: "Edge",    visitors: 173, fill: "#06b6d4" },
    { browser: "Other",   visitors: 90,  fill: "#a855f7" },
  ];

  const STAT_CARDS = [
    { icon: <IndianRupee />, bg: "bg-blue-100",   label: "Total Revenue",  value: "₹1,00,000", trend: "12.5%" },
    { icon: <CalendarDays />, bg: "bg-green-100", label: "Total Bookings", value: "100",        trend: "12.5%" },
    { icon: <Car />,          bg: "bg-cyan-100",  label: "Active Cars",    value: "10" },
    { icon: <Users />,        bg: "bg-orange-100",label: "Total Users",    value: "20" },
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

  const ChartPie = () => (
    <Card>
      <CardHeader>
        <CardTitle>Booking Distribution</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={{}} className="w-full max-w-xs">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie data={pieData} dataKey="visitors" nameKey="browser">
              <LabelList dataKey="browser" />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="h-4 w-4 text-green-500" /> Trending up
        </div>
      </CardFooter>
    </Card>
  );

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ChartLineDots />
        <ChartPie />
      </div>

    </div>
  );
};
