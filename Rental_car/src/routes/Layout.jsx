import Navbar from "@/admin/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

function Layout() {

    return (
        <>
            <Navbar />

            <main className="pt-20">
                <Outlet />
            </main>

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        background: '#1f2937',
                        color: '#f9fafb',
                        border: 'none',
                    },
                    classNames: {
                        success: 'border-l-4 !border-l-green-400',
                        error:   'border-l-4 !border-l-red-400',
                        warning: 'border-l-4 !border-l-yellow-400',
                        info:    'border-l-4 !border-l-blue-400',
                    },
                }}
            />
        </>
    );

}

export default Layout;