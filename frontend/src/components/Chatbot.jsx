import { useState } from "react"
import axios from "axios"
import "./Chatbot.css"

const questions = [
    { id: "categorie", texte: "Bonjour ! Quel type d'activité vous intéresse ?", options: ["Cuisine", "Sport", "Art", "Nature", "Musique", "Bien-être"] },
    { id: "budget", texte: "Quel est votre budget par personne ?", options: ["Moins de 20€", "20€ - 50€", "Plus de 50€"] },
    { id: "lieu", texte: "Vous êtes plutôt où ?", options: ["Paris", "Lyon", "Marseille", "Bordeaux", "Autre"] }
]

function Chatbot() {
    const [ouvert, setOuvert] = useState(false)
    const [etape, setEtape] = useState(0)
    const [reponses, setReponses] = useState({})
    const [messages, setMessages] = useState([
        { type: "bot", texte: questions[0].texte }
    ])
    const [resultats, setResultats] = useState([])
    const [termine, setTermine] = useState(false)

    const handleReponse = async (option) => {
        const questionActuelle = questions[etape]
        const nouvReponses = { ...reponses, [questionActuelle.id]: option }
        setReponses(nouvReponses)

        const nouveauxMessages = [
            ...messages,
            { type: "user", texte: option }
        ]

        if (etape + 1 < questions.length) {
            const prochaineQuestion = questions[etape + 1]
            setMessages([...nouveauxMessages, { type: "bot", texte: prochaineQuestion.texte }])
            setEtape(etape + 1)
        } else {
            setMessages([...nouveauxMessages, { type: "bot", texte: "Je cherche des activités pour vous..." }])
            setTermine(true)

            try {
                const res = await axios.get("http://localhost:3000/api/experiences?categorie=" + nouvReponses.categorie)
                let experiences = res.data

                if (nouvReponses.budget === "Moins de 20€") {
                    experiences = experiences.filter(e => e.prix < 20)
                } else if (nouvReponses.budget === "20€ - 50€") {
                    experiences = experiences.filter(e => e.prix >= 20 && e.prix <= 50)
                } else {
                    experiences = experiences.filter(e => e.prix > 50)
                }

                if (nouvReponses.lieu !== "Autre") {
                    const parLieu = experiences.filter(e => e.localisation && e.localisation.includes(nouvReponses.lieu))
                    if (parLieu.length > 0) experiences = parLieu
                }

                setResultats(experiences.slice(0, 3))

                if (experiences.length === 0) {
                    setMessages(prev => [...prev, { type: "bot", texte: "Désolé, aucune activité ne correspond à vos critères pour le moment." }])
                } else {
                    setMessages(prev => [...prev, { type: "bot", texte: "Voilà ce que j'ai trouvé pour vous !" }])
                }
            } catch (err) {
                setMessages(prev => [...prev, { type: "bot", texte: "Erreur lors de la recherche, réessayez plus tard." }])
            }
        }
    }

    const reinitialiser = () => {
        setEtape(0)
        setReponses({})
        setResultats([])
        setTermine(false)
        setMessages([{ type: "bot", texte: questions[0].texte }])
    }

    return (
        <div className="chatbot-wrapper">
            {ouvert && (
                <div className="chatbot-box">
                    <div className="chatbot-header">
                        <span>Assistant FunAndActivity</span>
                        <button onClick={() => setOuvert(false)} className="chatbot-close">✕</button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={msg.type === "bot" ? "msg-bot" : "msg-user"}>
                                {msg.texte}
                            </div>
                        ))}

                        {resultats.length > 0 && (
                            <div className="chatbot-resultats">
                                {resultats.map(exp => (
                                    <div key={exp.id} className="chatbot-carte" onClick={() => window.location.href = "/experience/" + exp.id}>
                                        <p className="chatbot-carte-titre">{exp.titre}</p>
                                        <p className="chatbot-carte-info">{exp.prix}€ · {exp.localisation}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!termine && (
                            <div className="chatbot-options">
                                {questions[etape].options.map(opt => (
                                    <button key={opt} onClick={() => handleReponse(opt)} className="chatbot-option">
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {termine && (
                            <button onClick={reinitialiser} className="chatbot-recommencer">
                                Recommencer
                            </button>
                        )}
                    </div>
                </div>
            )}

            <button className="chatbot-bulle" onClick={() => setOuvert(!ouvert)}>
                {ouvert ? "✕" : "💬"}
            </button>
        </div>
    )
}

export default Chatbot