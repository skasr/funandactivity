import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import "./Dashboard.css"

function Dashboard() {
    const { user, token } = useAuth()
    const navigate = useNavigate()
    const [mesExperiences, setMesExperiences] = useState([])
    const [mesReservations, setMesReservations] = useState([])

    useEffect(() => {
        if (user.role === "hote") {
            fetchMesExperiences()
        } else {
            fetchMesReservations()
        }
    }, [])

    const fetchMesExperiences = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/experiences/mes-experiences", {
                headers: { authorization: token }
            })
            setMesExperiences(res.data)
        } catch (err) {
            console.log("erreur")
        }
    }

    const fetchMesReservations = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/reservations/mes-reservations", {
                headers: { authorization: token }
            })
            setMesReservations(res.data)
        } catch (err) {
            console.log("erreur")
        }
    }

    const supprimerExperience = async (id) => {
        const confirme = window.confirm("Êtes-vous sûr de vouloir supprimer cette expérience ? Cette action est irréversible.")
        if (!confirme) return

        try {
            await axios.delete("http://localhost:3000/api/experiences/" + id, {
                headers: { authorization: token }
            })
            setMesExperiences(mesExperiences.filter(e => e.id !== id))
        } catch (err) {
            console.log("erreur suppression")
        }
    }

    const annulerReservation = async (id) => {
        try {
            await axios.put("http://localhost:3000/api/reservations/" + id + "/annuler", {}, {
                headers: { authorization: token }
            })
            fetchMesReservations()
        } catch (err) {
            console.log("erreur annulation")
        }
    }

    return (
        <div className="dash-container">
            <h2 className="dash-titre">Mon compte — {user.nom}</h2>
            <p className="dash-role">Rôle : {user.role}</p>

            {user.role === "hote" ? (
                <div>
                    <div className="dash-header">
                        <h3>Mes expériences</h3>
                        <button onClick={() => navigate("/nouvelle-experience")} className="dash-btn-ajouter">
                            + Nouvelle expérience
                        </button>
                    </div>
                    {mesExperiences.length === 0 ? (
                        <p className="dash-vide">Vous n'avez pas encore créé d'expérience</p>
                    ) : (
                        <div className="dash-liste">
                            {mesExperiences.map(exp => (
                                <div key={exp.id} className="dash-item">
                                    <div>
                                        <p className="dash-item-titre">{exp.titre}</p>
                                        <p className="dash-item-sub">{exp.categorie} · {exp.prix}€ · {exp.localisation}</p>
                                    </div>
                                    <div className="dash-actions">
                                        <button onClick={() => navigate("/experience/" + exp.id)} className="dash-btn-voir">Voir</button>
                                        <button onClick={() => navigate("/modifier-experience/" + exp.id)} className="dash-btn-modifier">Modifier</button>
                                        <button onClick={() => supprimerExperience(exp.id)} className="dash-btn-supp">Supprimer</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h3>Mes réservations</h3>
                    {mesReservations.length === 0 ? (
                        <p className="dash-vide">Vous n'avez pas encore de réservation</p>
                    ) : (
                        <div className="dash-liste">
                            {mesReservations.map(resa => (
                                <div key={resa.id} className="dash-item">
                                    <div>
                                        <p className="dash-item-titre">{resa.titre}</p>
                                        <p className="dash-item-sub">
                                            Le {resa.date_resa} · {resa.nb_personnes} personne(s) &nbsp;
                                            <span className={"dash-statut " + (resa.statut === "confirmee" ? "dash-statut-confirmee" : "dash-statut-annulee")}>
                                                {resa.statut}
                                            </span>
                                        </p>
                                    </div>
                                    {resa.statut === "confirmee" && (
                                        <button onClick={() => annulerReservation(resa.id)} className="dash-btn-supp">Annuler</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Dashboard