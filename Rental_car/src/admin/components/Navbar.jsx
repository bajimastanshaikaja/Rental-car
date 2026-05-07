import React, { useState, useContext } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/main";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { toast } from "sonner";

function Navbar() {
  const { currentUser, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/");
  };

  // Links shown only when logged in as admin
  const adminLinks = [
    { to: "/dashboard", label: "Admin Dashboard" },
    { to: "/managebookings", label: "Manage Bookings" },
    { to: "/managecars", label: "Manage Cars" },
  ];

  // Links shown only when logged in as user
  const userLinks = [
    { to: "/userDashboard", label: "Dashboard" },
    { to: "/browsecars", label: "Browse Cars" },
    { to: "/mybookings", label: "My Bookings" },
  ];

  // Home is always visible
  const publicLinks = [{ to: "/", label: "Home" }];

  const navLinks = !currentUser
    ? publicLinks
    : role === "admin"
      ? [...publicLinks, ...adminLinks]
      : role === "user"
        ? [...publicLinks, ...userLinks]
        : publicLinks;

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full h-20 bg-gray-100 shadow-md px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/carfav.png" alt="logo" className="w-12 h-12" />
            <h1 className="text-2xl font-bold">
              Rent<span className="text-orange-500 italic">X</span>
            </h1>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`font-medium transition-colors pb-1 border-b-2 ${
                        isActive
                          ? "text-blue-600 border-blue-600"
                          : "text-gray-700 border-transparent hover:text-blue-600"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* User pill */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-700">
                  <User size={15} className="text-blue-500" />
                  <span className="font-medium">
                    {currentUser.email?.split("@")[0]}
                  </span>
                </div>
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-500 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setOpen(true);
                }}
                className="rounded-md bg-blue-500 text-white px-5 py-2 hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg p-5 shadow-md">
            <ul className="flex flex-col gap-4 mb-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={`font-medium transition-colors ${
                        isActive ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {currentUser ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  Signed in as{" "}
                  <span className="font-semibold">{currentUser.email}</span>
                </p>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-red-300 text-red-500 py-2 rounded-md"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </nav>

      {/* Auth Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-8 rounded-2xl">
          {authMode === "login" ? (
            <Login
              openRegister={() => setAuthMode("register")}
              closeDialog={() => setOpen(false)}
            />
          ) : (
            <Register
              openLogin={() => setAuthMode("login")}
              closeDialog={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Navbar;
