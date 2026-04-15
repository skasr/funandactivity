import { useNavigate } from "react-router-dom"
import "./ExperienceCard.css"

function ExperienceCard({ experience }) {
    const navigate = useNavigate()

    return (
        <div className="card" onClick={() => navigate("/experience/" + experience.id)}>
            <div className="card-img-wrapper">
                <img
                    src={experience.image_url || "https://placehold.co/400x200?text=Pas+de+photo"}
                    alt={experience.titre}
                    className="card-img"
                />
                <span className="card-badge">{experience.categorie}</span>
            </div>
            <div className="card-body">
                <h3 className="card-titre">{experience.titre}</h3>
                <p className="card-lieu">📍 {experience.localisation}</p>
                <div className="card-footer">
                    <span className="card-prix">{experience.prix} € <span style={{ fontWeight: 400, fontSize: "13px", color: "var(--texte-gris)" }}>/ pers.</span></span>
                    <span className="card-hote">{experience.hote_nom}</span>
                </div>
            </div>
        </div>
    )
}

export default ExperienceCard
