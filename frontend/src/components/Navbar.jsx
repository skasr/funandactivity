import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import "./Navbar.css"

function Navbar() {
    const { user, logout, token } = useAuth()
    const navigate = useNavigate()
    const [nonLus, setNonLus] = useState(0)

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    useEffect(() => {
        if (!user || !token) { setNonLus(0); return }
        const fetch = () => {
            axios.get("http://localhost:3000/api/conversations/non-lus", {
                headers: { authorization: token }
            }).then(res => setNonLus(res.data.non_lus)).catch(() => {})
        }
        fetch()
        const interval = setInterval(fetch, 10000)
        return () => clearInterval(interval)
    }, [user, token])

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
                        <Link to="/messages" className="navbar-link navbar-messages">
                            Messages
                            {nonLus > 0 && <span className="navbar-badge">{nonLus}</span>}
                        </Link>
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