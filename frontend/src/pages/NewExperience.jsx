import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import "./NewExperience.css"

function NewExperience() {
    const { token } = useAuth()
    const navigate = useNavigate()

    const [titre, setTitre] = useState("")
    const [description, setDescription] = useState("")
    const [categorie, setCategorie] = useState("Cuisine")
    const [prix, setPrix] = useState("")
    const [capacite, setCapacite] = useState(1)
    const [localisation, setLocalisation] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [erreur, setErreur] = useState("")

    const categories = ["Cuisine", "Sport", "Art", "Nature", "Musique", "Bien-être"]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErreur("")

        try {
            await axios.post(
                "http://localhost:3000/api/experiences",
                { titre, description, categorie, prix, capacite, localisation, image_url: imageUrl },
                { headers: { authorization: token } }
            )
            navigate("/dashboard")
        } catch (err) {
            setErreur("Erreur lors de la création")
        }
    }

    return (
        <div className="new-container">
            <div className="new-box">
                <h2 className="new-titre">Créer une expérience</h2>
                {erreur && <p className="new-erreur">{erreur}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="new-champ">
                        <label>Titre</label>
                        <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} className="new-input" required />
                    </div>
                    <div className="new-champ">
                        <label>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="new-textarea" rows={4} />
                    </div>
                    <div className="new-champ">
                        <label>Catégorie</label>
                        <select value={categorie} onChange={(e) => setCategorie(e.target.value)} className="new-input">
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="new-row">
                        <div className="new-champ">
                            <label>Prix (€)</label>
                            <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} className="new-input" required min="0" />
                        </div>
                        <div className="new-champ">
                            <label>Capacité max</label>
                            <input type="number" value={capacite} onChange={(e) => setCapacite(e.target.value)} className="new-input" min="1" />
                        </div>
                    </div>
                    <div className="new-champ">
                        <label>Localisation</label>
                        <input type="text" value={localisation} onChange={(e) => setLocalisation(e.target.value)} className="new-input" />
                    </div>
                    <div className="new-champ">
                        <label>URL de l'image</label>
                        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="new-input" placeholder="https://..." />
                    </div>
                    <button type="submit" className="new-btn">Publier l'expérience</button>
                </form>
            </div>
        </div>
    )
}

export default NewExperience