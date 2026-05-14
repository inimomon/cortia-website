import { Link, useLocation } from "react-router-dom";

export default function Navbar({ variant = "default" }) {
  const location = useLocation();
  const path = location.pathname;

  const navSets = [
    { label: "Home", to: "/" },
    { label: "Explore", to: "/explore" },
    { label: "Feature", to: "/feature" },
    { label: "Audit", to: "/audit" },
    { label: "Dashboard", to: "/dashboard" },
  ];

  const links = navSets;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900 font-serif"
        >
          CORTIA
        </Link>

        <div className="flex items-center gap-8">
          {links.map((l) => {
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
      </div>
    </nav>
  );
}