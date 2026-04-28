import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, LogOut, Shield, MessageSquarePlus, List } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, logout, admin } = useAuth();
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-widest uppercase transition-all duration-300 ${
      location.pathname === path
        ? "text-gold border-b border-gold"
        : "text-smoke hover:text-gold-light"
    }`;

  return (
    <nav className="bg-charcoal/80 backdrop-blur-md border-b border-gold/[0.07] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <GraduationCap className="w-6 h-6 text-gold transition-transform duration-300 group-hover:scale-110" />
            <span className="font-serif text-xl text-champagne tracking-wider">SFMS</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link to="/" className={linkClass("/")}>
              <MessageSquarePlus className="w-3.5 h-3.5" />
              Feedback
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/admin" className={linkClass("/admin")}>
                  <List className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <div className="w-px h-5 bg-ash mx-3" />
                <span className="text-xs text-smoke tracking-wide italic font-serif">
                  {admin?.username}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium tracking-widest uppercase text-crimson-light hover:text-champagne transition-colors duration-300 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Exit
                </button>
              </>
            ) : (
              <Link to="/login" className={linkClass("/login")}>
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
