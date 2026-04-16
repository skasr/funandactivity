import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import "./Messagerie.css"

function Messagerie() {
    const { user, token } = useAuth()
    const navigate = useNavigate()
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get("http://localhost:3000/api/conversations", {
            headers: { authorization: token }
        })
            .then(res => setConversations(res.data))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [token])

    const getInterlocuteur = (conv) => {
        return user.id === conv.visiteur_id ? conv.hote_nom : conv.visiteur_nom
    }

    if (loading) return <p className="msg-loading">Chargement...</p>

    return (
        <div className="msg-container">
            <h1 className="msg-titre">Mes messages</h1>

            {conversations.length === 0 ? (
                <p className="msg-vide">Aucune conversation pour le moment</p>
            ) : (
                <div className="msg-liste">
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            className={"msg-item" + (conv.non_lus > 0 ? " msg-item-nonlu" : "")}
                            onClick={() => navigate("/messages/" + conv.id)}
                        >
                            <img
                                src={conv.experience_image || "https://placehold.co/56x56?text=?"}
                                alt={conv.experience_titre}
                                className="msg-img"
                            />
                            <div className="msg-infos">
                                <div className="msg-header">
                                    <span className="msg-nom">{getInterlocuteur(conv)}</span>
                                    {conv.dernier_message_at && (
                                        <span className="msg-date">
                                            {new Date(conv.dernier_message_at).toLocaleDateString("fr-FR")}
                                        </span>
                                    )}
                                </div>
                                <span className="msg-experience">{conv.experience_titre}</span>
                                <p className="msg-apercu">
                                    {conv.dernier_message || "Pas encore de message"}
                                </p>
                            </div>
                            {conv.non_lus > 0 && (
                                <span className="msg-badge">{conv.non_lus}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Messagerie
