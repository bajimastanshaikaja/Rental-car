import { createBrowserRouter } from "react-router-dom";

import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";

import { Dashboard } from "@/admin/pages/Dashboard";
import Home from "@/admin/pages/Home";
import { ManageCars } from "@/admin/pages/ManageCars";
import ManageBookings from "@/admin/pages/ManageBookings";
import BrowseCars from "@/users/BrowseCars";
import Mybookings from "@/users/Mybookings";
import UserDashboard from "@/users/UserDashboard";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            // Public
            { index: true, element: <Home /> },

            // Admin only
            {
                path: "dashboard",
                element: <ProtectedRoute allowedRoles={["admin"]}><Dashboard /></ProtectedRoute>,
            },
            {
                path: "managecars",
                element: <ProtectedRoute allowedRoles={["admin"]}><ManageCars /></ProtectedRoute>,
            },
            {
                path: "managebookings",
                element: <ProtectedRoute allowedRoles={["admin"]}><ManageBookings /></ProtectedRoute>,
            },

            // User only
            {
                path: "browsecars",
                element: <ProtectedRoute allowedRoles={["user"]}><BrowseCars /></ProtectedRoute>,
            },
            {
                path: "mybookings",
                element: <ProtectedRoute allowedRoles={["user"]}><Mybookings /></ProtectedRoute>,
            },
            {
                path: "userDashboard",
                element: <ProtectedRoute allowedRoles={["user"]}><UserDashboard /></ProtectedRoute>,
            },
        ],
    },
]);
