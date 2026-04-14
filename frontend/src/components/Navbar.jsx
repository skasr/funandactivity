import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Navbar.css"

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">FunAndActivity</Link>
            <div className="navbar-links">
                {user ? (
                    <>
                        <span className="navbar-welcome">Bonjour {user.nom}</span>
                        {user.role === "hote" && (
                            <Link to="/nouvelle-experience" className="navbar-link">+ Ajouter</Link>
                        )}
                        <Link to="/dashboard" className="navbar-link">Mon compte</Link>
                        <button onClick={handleLogout} className="navbar-btn">Déconnexion</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-link">Connexion</Link>
                        <Link to="/register" className="navbar-link">Inscription</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar