import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "@/main";
import { ShieldX } from "lucide-react";

function ProtectedRoute({ children, allowedRoles }) {
    const { currentUser, role, authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    // Wait for Firebase auth to resolve before making any decision
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                Loading...
            </div>
        );
    }

    // Not logged in → back to home
    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    // Logged in but wrong role → show access denied
    if (allowedRoles && !allowedRoles.includes(role)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
                <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center gap-4 max-w-sm w-full text-center">
                    <div className="bg-red-100 p-4 rounded-full">
                        <ShieldX size={36} className="text-red-500" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">Access Denied</h1>
                    <p className="text-gray-500 text-sm">
                        You don't have permission to view this page.
                    </p>
                    <button
                        onClick={() => navigate(role === "admin" ? "/dashboard" : "/browsecars")}
                        className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Go to my dashboard
                    </button>
                </div>
            </div>
        );
    }

    return children;
}

export default ProtectedRoute;
