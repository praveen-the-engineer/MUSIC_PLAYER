import { Link, useLocation } from "react-router"

export const Navbar = () => {
    const location = useLocation();
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link className="brand-link" to="/">
                   PRAVEEN'S Music Player
                </Link>
            </div>

            <div className="navbar-links">
                <Link to="/AllSongs" className={`nav-link ${location.pathname === "/AllSongs" ? "active" : ""}`}>
                    All Songs
                </Link>
                <Link to="/playlists" className={`nav-link ${location.pathname === "/playlists" ? "active" : ""}`}>
                    playlists
                </Link>
            </div>
        </nav>
    );
};