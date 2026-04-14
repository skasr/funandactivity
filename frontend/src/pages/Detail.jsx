import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import "./Detail.css"

function Detail() {
    const { id } = useParams()
    const { user, token } = useAuth()
    const navigate = useNavigate()

    const [experience, setExperience] = useState(null)
    const [dateResa, setDateResa] = useState("")
    const [nbPersonnes, setNbPersonnes] = useState(1)
    const [message, setMessage] = useState("")
    const [erreur, setErreur] = useState("")

    useEffect(() => {
        axios.get("http://localhost:3000/api/experiences/" + id)
            .then(res => setExperience(res.data))
            .catch(() => navigate("/"))
    }, [id])

    const handleReservation = async (e) => {
        e.preventDefault()
        setMessage("")
        setErreur("")

        try {
            await axios.post(
                "http://localhost:3000/api/reservations",
                { experience_id: id, date_resa: dateResa, nb_personnes: nbPersonnes },
                { headers: { authorization: token } }
            )
            setMessage("Réservation confirmée !")
        } catch (err) {
            setErreur("Erreur lors de la réservation")
        }
    }

    if (!experience) return <p className="detail-loading">Chargement...</p>

    return (
        <div className="detail-container">
            <img
                src={experience.image_url || "https://placehold.co/800x300?text=Pas+de+photo"}
                alt={experience.titre}
                className="detail-img"
            />
            <div className="detail-contenu">
                <div className="detail-infos">
                    <span className="detail-categorie">{experience.categorie}</span>
                    <h1 className="detail-titre">{experience.titre}</h1>
                    <p className="detail-lieu">📍 {experience.localisation}</p>
                    <p className="detail-hote">Proposé par {experience.hote_nom}</p>
                    <p className="detail-description">{experience.description}</p>
                    <p className="detail-capacite">Capacité max : {experience.capacite} personne(s)</p>
                </div>

                <div className="detail-resa-box">
                    <p className="detail-prix">{experience.prix} € / personne</p>
                    {user ? (
                        user.role === "visiteur" ? (
                            <form onSubmit={handleReservation}>
                                <div className="detail-champ">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={dateResa}
                                        onChange={(e) => setDateResa(e.target.value)}
                                        className="detail-input"
                                        required
                                    />
                                </div>
                                <div className="detail-champ">
                                    <label>Nombre de personnes</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={experience.capacite}
                                        value={nbPersonnes}
                                        onChange={(e) => setNbPersonnes(e.target.value)}
                                        className="detail-input"
                                    />
                                </div>
                                {message && <p className="detail-success">{message}</p>}
                                {erreur && <p className="detail-erreur">{erreur}</p>}
                                <button type="submit" className="detail-btn">Réserver</button>
                            </form>
                        ) : (
                            <p className="detail-hote-msg">Les hôtes ne peuvent pas réserver</p>
                        )
                    ) : (
                        <button onClick={() => navigate("/login")} className="detail-btn">
                            Connectez-vous pour réserver
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Detail