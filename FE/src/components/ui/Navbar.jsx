import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import ProfileModal from "./ProfileModal";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const path = location.pathname;

  const navSets = [
    { label: "Home", to: "/" },
    { label: "Explore", to: "/explore" },
    { label: "Feature", to: "/feature" },
    { label: "Audit", to: "/audit" },
    { label: "Dashboard", to: "/dashboard" },
  ];

  const token = localStorage.getItem("token");

  let userName = "User";
  let email = "user@gmail.com";

  if (token) {
    try {
      const decoded = jwtDecode(token);

      userName = decoded.username || "User";
      email = decoded.email || "user@gmail.com";
    } catch (error) {
      console.log("Invalid token");
    }
  }

  const firstLetter = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-5000 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900 font-serif"
        >
          CORTIA
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navSets.map((l) => {
            const active =
              path === l.to || (l.to !== "/" && path.startsWith(l.to));

            return (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-gray-900 border-b-2 border-gray-900 pb-0.5"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          
          {/* Auth */}
          <div className="relative">
            {!token ? (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm"
              >
                {firstLetter}
              </button>
            )}

            <ProfileModal
              open={openProfile}
              onClose={() => setOpenProfile(false)}
              userName={userName}
              email={email}
              onLogout={handleLogout}
            />
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1"
          >
            <span className="w-5 h-0.5 bg-black"></span>
            <span className="w-5 h-0.5 bg-black"></span>
            <span className="w-5 h-0.5 bg-black"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-6 py-4 flex flex-col gap-4">
          {navSets.map((l) => {
            const active =
              path === l.to || (l.to !== "/" && path.startsWith(l.to));

            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium ${
                  active ? "text-black" : "text-gray-500"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}