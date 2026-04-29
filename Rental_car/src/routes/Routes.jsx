import { createBrowserRouter } from "react-router-dom";

import Layout from "./Layout";

import { Dashboard } from "@/admin/pages/Dashboard";
import Home from "@/admin/pages/Home";
import { ManageCars } from "@/admin/pages/ManageCars";
import BrowseCars from "@/users/BrowseCars";
import Mybookings from "@/users/Mybookings";


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
            {
                path: "managecars",
                element: <ManageCars />
            },
            {
                path: "mybookings",
                element: <Mybookings />
            }



        ]

    }

]);