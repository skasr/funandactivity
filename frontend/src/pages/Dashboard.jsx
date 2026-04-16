import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import "./Dashboard.css"

function Dashboard() {
    const { user, token, updateUser } = useAuth()
    const navigate = useNavigate()
    const [mesExperiences, setMesExperiences] = useState([])
    const [mesReservations, setMesReservations] = useState([])

    // Profil
    const [profilOuvert, setProfilOuvert] = useState(false)
    const [nom, setNom] = useState(user.nom)
    const [email, setEmail] = useState(user.email)
    const [mdpActuel, setMdpActuel] = useState("")
    const [nouveauMdp, setNouveauMdp] = useState("")
    const [confirmMdp, setConfirmMdp] = useState("")
    const [profilSucces, setProfilSucces] = useState("")
    const [profilErreur, setProfilErreur] = useState("")
    const [profilLoading, setProfilLoading] = useState(false)

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

    const handleProfilSubmit = async (e) => {
        e.preventDefault()
        setProfilErreur("")
        setProfilSucces("")

        if (nouveauMdp && nouveauMdp !== confirmMdp) {
            setProfilErreur("Les mots de passe ne correspondent pas")
            return
        }

        setProfilLoading(true)
        try {
            const res = await axios.put(
                "http://localhost:3000/api/auth/profil",
                {
                    nom,
                    email,
                    mot_de_passe_actuel: mdpActuel || undefined,
                    nouveau_mot_de_passe: nouveauMdp || undefined
                },
                { headers: { authorization: token } }
            )
            updateUser(res.data.user, res.data.token)
            setProfilSucces("Profil mis à jour !")
            setMdpActuel("")
            setNouveauMdp("")
            setConfirmMdp("")
        } catch (err) {
            setProfilErreur(err.response?.data?.message || "Erreur lors de la mise à jour")
        } finally {
            setProfilLoading(false)
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
            <h2 className="dash-titre">Bonjour, {user.nom}</h2>
            <p className="dash-role">{user.role}</p>

            {/* ── Section profil ── */}
            <div className="dash-profil-section">
                <button
                    className="dash-profil-toggle"
                    onClick={() => { setProfilOuvert(!profilOuvert); setProfilSucces(""); setProfilErreur("") }}
                >
                    <span className="dash-profil-toggle-left">
                        <span className="dash-profil-avatar">{user.nom.charAt(0).toUpperCase()}</span>
                        <span>
                            <span className="dash-profil-nom">{user.nom}</span>
                            <span className="dash-profil-email">{user.email}</span>
                        </span>
                    </span>
                    <span className={"dash-profil-chevron" + (profilOuvert ? " ouvert" : "")}>›</span>
                </button>

                {profilOuvert && (
                    <form className="dash-profil-form" onSubmit={handleProfilSubmit}>
                        <div className="dash-profil-grid">
                            <div className="dash-profil-champ">
                                <label>Nom</label>
                                <input
                                    type="text"
                                    value={nom}
                                    onChange={e => setNom(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="dash-profil-champ">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="dash-profil-separator">
                            <span>Changer le mot de passe <em>(optionnel)</em></span>
                        </div>

                        <div className="dash-profil-grid">
                            <div className="dash-profil-champ">
                                <label>Mot de passe actuel</label>
                                <input
                                    type="password"
                                    value={mdpActuel}
                                    onChange={e => setMdpActuel(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="dash-profil-champ">
                                <label>Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={nouveauMdp}
                                    onChange={e => setNouveauMdp(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="dash-profil-champ">
                                <label>Confirmer le nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={confirmMdp}
                                    onChange={e => setConfirmMdp(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {profilErreur && <p className="dash-profil-erreur">{profilErreur}</p>}
                        {profilSucces && <p className="dash-profil-succes">{profilSucces}</p>}

                        <div className="dash-profil-actions">
                            <button type="submit" className="dash-profil-btn" disabled={profilLoading}>
                                {profilLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                            </button>
                            <button type="button" className="dash-profil-annuler" onClick={() => setProfilOuvert(false)}>
                                Annuler
                            </button>
                        </div>
                    </form>
                )}
            </div>

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