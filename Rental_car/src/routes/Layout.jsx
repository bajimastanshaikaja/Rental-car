import Navbar from "@/admin/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

function Layout() {

    return (
        <>
            <Navbar />

            <main className="pt-20">
                <Outlet />
            </main>

            <Toaster richColors position="top-right" />
        </>
    );

}

export default Layout;