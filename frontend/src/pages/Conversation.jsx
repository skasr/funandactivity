import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import "./Conversation.css"

function Conversation() {
    const { id } = useParams()
    const { user, token } = useAuth()
    const navigate = useNavigate()

    const [conversation, setConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [contenu, setContenu] = useState("")
    const [loading, setLoading] = useState(true)
    const [envoi, setEnvoi] = useState(false)
    const bottomRef = useRef(null)
    const pollingRef = useRef(null)

    const fetchMessages = async (silent = false) => {
        try {
            const res = await axios.get("http://localhost:3000/api/conversations/" + id, {
                headers: { authorization: token }
            })
            setConversation(res.data.conversation)
            setMessages(res.data.messages)
            if (!silent) setLoading(false)
        } catch {
            if (!silent) navigate("/messages")
        }
    }

    useEffect(() => {
        fetchMessages()
        pollingRef.current = setInterval(() => fetchMessages(true), 3000)
        return () => clearInterval(pollingRef.current)
    }, [id, token])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleEnvoi = async (e) => {
        e.preventDefault()
        if (!contenu.trim() || envoi) return

        setEnvoi(true)
        try {
            await axios.post(
                "http://localhost:3000/api/conversations/" + id + "/messages",
                { contenu },
                { headers: { authorization: token } }
            )
            setContenu("")
            await fetchMessages(true)
        } catch {
        } finally {
            setEnvoi(false)
        }
    }

    const getInterlocuteur = () => {
        if (!conversation) return ""
        return user.id === conversation.visiteur_id
            ? conversation.hote_nom
            : conversation.visiteur_nom
    }

    const formatHeure = (dateStr) => {
        const d = new Date(dateStr)
        const today = new Date()
        const isToday = d.toDateString() === today.toDateString()
        if (isToday) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
        return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " " +
            d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    }

    if (loading) return <p className="conv-loading">Chargement...</p>

    return (
        <div className="conv-container">
            <div className="conv-header">
                <button className="conv-retour" onClick={() => navigate("/messages")}>← Retour</button>
                <div className="conv-header-infos">
                    <span className="conv-interlocuteur">{getInterlocuteur()}</span>
                    <span className="conv-experience-nom">{conversation?.experience_titre || ""}</span>
                </div>
            </div>

            <div className="conv-messages">
                {messages.length === 0 && (
                    <p className="conv-vide">Commencez la conversation !</p>
                )}
                {messages.map(msg => {
                    const estMoi = msg.sender_id === user.id
                    return (
                        <div key={msg.id} className={"conv-msg" + (estMoi ? " conv-msg-moi" : " conv-msg-autre")}>
                            <div className="conv-msg-bulle">
                                <p className="conv-msg-contenu">{msg.contenu}</p>
                                <span className="conv-msg-heure">{formatHeure(msg.created_at)}</span>
                            </div>
                        </div>
                    )
                })}
                <div ref={bottomRef} />
            </div>

            <form className="conv-form" onSubmit={handleEnvoi}>
                <input
                    type="text"
                    className="conv-input"
                    placeholder="Écrire un message..."
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                    autoComplete="off"
                />
                <button type="submit" className="conv-btn" disabled={envoi || !contenu.trim()}>
                    Envoyer
                </button>
            </form>
        </div>
    )
}

export default Conversation
