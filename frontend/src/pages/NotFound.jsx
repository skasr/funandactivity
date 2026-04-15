import { useNavigate } from "react-router-dom"
import "./NotFound.css"

function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="notfound-container">
            <p className="notfound-code">404</p>
            <h1 className="notfound-titre">Page introuvable</h1>
            <p className="notfound-sub">Cette page n'existe pas ou a été déplacée.</p>
            <button onClick={() => navigate("/")} className="notfound-btn">
                Retour à l'accueil
            </button>
        </div>
    )
}

export default NotFound
