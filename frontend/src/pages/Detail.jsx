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

    const [avis, setAvis] = useState([])
    const [noteChoisie, setNoteChoisie] = useState(0)
    const [noteHover, setNoteHover] = useState(0)
    const [commentaire, setCommentaire] = useState("")
    const [avisErreur, setAvisErreur] = useState("")
    const [avisMessage, setAvisMessage] = useState("")

    useEffect(() => {
        axios.get("http://localhost:3000/api/experiences/" + id)
            .then(res => setExperience(res.data))
            .catch(() => navigate("/"))
        fetchAvis()
    }, [id])

    const fetchAvis = () => {
        axios.get("http://localhost:3000/api/experiences/" + id + "/avis")
            .then(res => setAvis(res.data))
            .catch(() => {})
    }

    const handleAvis = async (e) => {
        e.preventDefault()
        setAvisErreur("")
        setAvisMessage("")

        if (noteChoisie === 0) {
            setAvisErreur("Veuillez choisir une note")
            return
        }

        try {
            await axios.post(
                "http://localhost:3000/api/experiences/" + id + "/avis",
                { note: noteChoisie, commentaire },
                { headers: { authorization: token } }
            )
            setAvisMessage("Avis publié !")
            setNoteChoisie(0)
            setCommentaire("")
            fetchAvis()
        } catch (err) {
            setAvisErreur(err.response?.data?.message || "Erreur lors de l'envoi")
        }
    }

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
                    <p className="detail-prix">{experience.prix} € <span>/ personne</span></p>
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
            <div className="detail-avis">
                <h2 className="detail-avis-titre">Avis</h2>

                {user && user.role === "visiteur" && (
                    <form className="detail-avis-form" onSubmit={handleAvis}>
                        <p className="detail-avis-label">Votre note</p>
                        <div className="detail-etoiles">
                            {[1, 2, 3, 4, 5].map(n => (
                                <span
                                    key={n}
                                    className={"etoile" + (n <= (noteHover || noteChoisie) ? " etoile-active" : "")}
                                    onClick={() => setNoteChoisie(n)}
                                    onMouseEnter={() => setNoteHover(n)}
                                    onMouseLeave={() => setNoteHover(0)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            className="detail-avis-textarea"
                            placeholder="Votre commentaire (facultatif)"
                            value={commentaire}
                            onChange={(e) => setCommentaire(e.target.value)}
                            rows={3}
                        />
                        {avisErreur && <p className="detail-erreur">{avisErreur}</p>}
                        {avisMessage && <p className="detail-success">{avisMessage}</p>}
                        <button type="submit" className="detail-avis-btn">Publier l'avis</button>
                    </form>
                )}

                {avis.length === 0 ? (
                    <p className="detail-avis-vide">Aucun avis pour le moment</p>
                ) : (
                    <div className="detail-avis-liste">
                        {avis.map(a => (
                            <div key={a.id} className="detail-avis-item">
                                <div className="detail-avis-header">
                                    <span className="detail-avis-auteur">{a.auteur}</span>
                                    <span className="detail-avis-note">
                                        {"★".repeat(a.note)}{"☆".repeat(5 - a.note)}
                                    </span>
                                </div>
                                {a.commentaire && <p className="detail-avis-commentaire">{a.commentaire}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Detail