import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";
import Register from "../pages/Register";
import Login from "../pages/Login";
function Navbar() {

    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [authMode, setAuthMode] = useState("login");

    return (
        <>
            <nav className="fixed top-0 left-0 z-50 w-full h-20 bg-gray-100 shadow-md px-6 py-4">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">
                        <img
                            src="/carfav.png"
                            alt="logo"
                            className="w-12 h-12"
                        />

                        <h1 className="text-2xl font-bold">
                            Rent <span className="text-orange-500 italic">X</span>
                        </h1>
                    </div>


                    <div className="hidden md:flex items-center gap-8">

                        <ul className="flex gap-6">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/browsecars">Browse Cars</Link></li>
                            <li><Link to="/mybookings">My Bookings</Link></li>
                        </ul>

                        <button
                            onClick={() => {
                                setAuthMode("login");
                                setOpen(true);
                            }}
                            className="rounded-md bg-blue-500 text-white px-5 py-2"
                        >
                            Login
                        </button>

                    </div>


                    <button
                        className="md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X /> : <Menu />}
                    </button>

                </div>


                {menuOpen && (
                    <div className="md:hidden mt-4 bg-white rounded-lg p-5">

                        <ul className="flex flex-col gap-4 mb-4">
                            <li>
                                <Link to="/" onClick={() => setMenuOpen(false)}>
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                                    Dashboard
                                </Link>
                            </li>

                            <li>
                                <Link to="/browsecars" onClick={() => setMenuOpen(false)}>
                                    Browse Cars
                                </Link>
                            </li>

                            <li>
                                <Link to="/mybookings" onClick={() => setMenuOpen(false)}>
                                    My Bookings
                                </Link>
                            </li>
                        </ul>


                        <button
                            onClick={() => {
                                setAuthMode("login");
                                setOpen(true);
                                setMenuOpen(false);
                            }}
                            className="w-full bg-blue-500 text-white py-2 rounded-md"
                        >
                            Login
                        </button>

                    </div>
                )}

            </nav>


            <Dialog open={open} onOpenChange={setOpen}>

                <DialogContent className="sm:max-w-md p-8 rounded-2xl">

                    {authMode === "login" ? (
                        <Login openRegister={() => setAuthMode("register")} />
                    ) : (
                        <Register openLogin={() => setAuthMode("login")} />
                    )}

                </DialogContent>

            </Dialog>

        </>
    );
}

export default Navbar;