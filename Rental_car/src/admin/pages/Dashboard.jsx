import React from "react";

import {
  CalendarDays,
  Car,
  IndianRupee,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  PieChart,
  Pie,
  LabelList,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const Dashboard = () => {

  // 🔵 LINE CHART DATA
  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  };

  // 🟠 PIE CHART DATA
  const pieData = [
    { browser: "Chrome", visitors: 275, fill: "#3b82f6" },
    { browser: "Safari", visitors: 200, fill: "#22c55e" },
    { browser: "Firefox", visitors: 187, fill: "#f97316" },
    { browser: "Edge", visitors: 173, fill: "#06b6d4" },
    { browser: "Other", visitors: 90, fill: "#a855f7" },
  ];

  // 🔵 LINE CHART COMPONENT
  const ChartLineDots = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Line Chart</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>

        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="month"
                tickFormatter={(value) => value.slice(0, 3)}
              />

              <ChartTooltip content={<ChartTooltipContent />} />

              <Line dataKey="desktop" stroke="blue" />
            </LineChart>
          </ChartContainer>
        </CardContent>

        <CardFooter>
          <div className="flex items-center gap-2 text-sm">
            Trending up <TrendingUp className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    );
  };

  // 🟠 PIE CHART COMPONENT
  const ChartPie = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visitors Distribution</CardTitle>
          <CardDescription>Last 6 months</CardDescription>
        </CardHeader>

        <CardContent>
          <ChartContainer config={{}}>
            <PieChart width={300} height={300}>
              <ChartTooltip content={<ChartTooltipContent />} />

              <Pie data={pieData} dataKey="visitors" nameKey="browser">
                <LabelList dataKey="browser" />
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
    <div className="bg-gray-100 min-h-screen p-3">

      <div>
        <h1 className="text-2xl font-bold p-2">Admin Dashboard</h1>
        <p className="font-light ml-1.5">
          Welcome back! Here's what's happening with your rental business.
        </p>
      </div>

      {/* ✅ YOUR 4 CARDS (UNCHANGED) */}
      <div className="flex mt-8 justify-evenly mx-4">

        <div className="bg-white w-70 rounded-xl h-65 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="bg-blue-300 p-3 rounded-full">
              <IndianRupee />
            </div>
            <div className="flex gap-2">
              <TrendingUp className="size-4" />
              12.5%
            </div>
          </div>
          <div className="mt-15"> Total revenue</div>
          <div className="flex gap-1 font-bold text-2xl items-center mt-4">
            <IndianRupee /> 100000
          </div>
        </div>

        <div className="bg-white w-70 rounded-xl h-65 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="bg-green-200 p-3 rounded-full">
              <CalendarDays />
            </div>
            <div className="flex gap-2">
              <TrendingUp className="size-4" />
              12.5%
            </div>
          </div>
          <div className="mt-15"> Total Bookings</div>
          <div className="flex gap-1 font-bold text-2xl items-center mt-4">
            100
          </div>
        </div>

        <div className="bg-white w-70 rounded-xl h-65 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="bg-cyan-200 p-3 rounded-full">
              <Car />
            </div>
          </div>
          <div className="mt-15"> Active Cars</div>
          <div className="flex gap-1 font-bold text-2xl items-center mt-4">
            <IndianRupee /> 10
          </div>
        </div>

        <div className="bg-white w-70 rounded-xl h-65 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="bg-orange-200 p-3 rounded-full">
              <Users />
            </div>
          </div>
          <div className="mt-15"> Total Users</div>
          <div className="flex gap-1 font-bold text-2xl items-center mt-4">
            20
          </div>
        </div>

      </div>
      <div className="flex items-center justify-between gap-2">
        {/* 🔵 LINE CHART */}
        <div className="mt-10 p-5 w-170">
          <ChartLineDots />
        </div>


        <div className="mt-10 p-5 w-170">
          <ChartPie />
        </div>
      </div>
    </div>
  );
};