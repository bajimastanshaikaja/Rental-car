import { createBrowserRouter } from "react-router-dom";

import Layout from "./Layout";

import { Dashboard } from "@/admin/pages/Dashboard";
import BrowseCars from "@/users/BrowseCars";
import Home from "@/admin/pages/Home";


export const router = createBrowserRouter([

    {
        path: "/",
        element: <Layout />,

        children: [

            {
                index: true,
                element: <Home />
            },

            {
                path: "dashboard",
                element: <Dashboard />
            },

            {
                path: "browsecars",
                element: <BrowseCars />
            },

            // {
            //     path: "mybookings",
            //     element: <MyBookings />
            // }

        ]

    }

]);