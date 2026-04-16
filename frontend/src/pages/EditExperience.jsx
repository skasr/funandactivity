import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import "./NewExperience.css"

function EditExperience() {
    const { token } = useAuth()
    const navigate = useNavigate()
    const { id } = useParams()

    const [titre, setTitre] = useState("")
    const [description, setDescription] = useState("")
    const [categorie, setCategorie] = useState("Cuisine")
    const [prix, setPrix] = useState("")
    const [capacite, setCapacite] = useState(1)
    const [localisation, setLocalisation] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [imagePreview, setImagePreview] = useState("")
    const [imageUploading, setImageUploading] = useState(false)
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [geocodeStatus, setGeocodeStatus] = useState("")
    const [erreur, setErreur] = useState("")
    const [chargement, setChargement] = useState(true)

    const categories = ["Cuisine", "Sport", "Art", "Nature", "Musique", "Bien-être"]

    useEffect(() => {
        axios.get("http://localhost:3000/api/experiences/" + id)
            .then(res => {
                const exp = res.data
                setTitre(exp.titre)
                setDescription(exp.description || "")
                setCategorie(exp.categorie)
                setPrix(exp.prix)
                setCapacite(exp.capacite)
                setLocalisation(exp.localisation || "")
                setImageUrl(exp.image_url || "")
                setImagePreview(exp.image_url || "")
                setLatitude(exp.latitude || null)
                setLongitude(exp.longitude || null)
                if (exp.latitude) setGeocodeStatus("📍 " + (exp.localisation || ""))
                setChargement(false)
            })
            .catch(() => {
                setErreur("Impossible de charger l'expérience")
                setChargement(false)
            })
    }, [id])

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImagePreview(URL.createObjectURL(file))
        setImageUploading(true)
        try {
            const formData = new FormData()
            formData.append("image", file)
            const res = await axios.post("http://localhost:3000/api/upload", formData, {
                headers: { authorization: token, "Content-Type": "multipart/form-data" }
            })
            setImageUrl(res.data.url)
        } catch {
            setErreur("Erreur lors de l'upload de l'image")
        } finally {
            setImageUploading(false)
        }
    }

    const geocoder = async (adresse) => {
        if (!adresse.trim()) return
        setGeocodeStatus("recherche...")
        try {
            const res = await fetch(
                "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(adresse),
                { headers: { "Accept-Language": "fr" } }
            )
            const data = await res.json()
            if (data.length > 0) {
                setLatitude(parseFloat(data[0].lat))
                setLongitude(parseFloat(data[0].lon))
                setGeocodeStatus("📍 " + data[0].display_name.split(",").slice(0, 2).join(", "))
            } else {
                setLatitude(null)
                setLongitude(null)
                setGeocodeStatus("Adresse introuvable sur la carte")
            }
        } catch {
            setGeocodeStatus("")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErreur("")

        try {
            await axios.put(
                "http://localhost:3000/api/experiences/" + id,
                { titre, description, categorie, prix, capacite, localisation, image_url: imageUrl, latitude, longitude },
                { headers: { authorization: token } }
            )
            navigate("/dashboard")
        } catch (err) {
            setErreur("Erreur lors de la modification")
        }
    }

    if (chargement) return <p style={{ textAlign: "center", marginTop: "40px" }}>Chargement...</p>

    return (
        <div className="new-container">
            <div className="new-box">
                <h2 className="new-titre">Modifier l'expérience</h2>
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
                        <input
                            type="text"
                            value={localisation}
                            onChange={(e) => { setLocalisation(e.target.value); setGeocodeStatus("") }}
                            onBlur={(e) => geocoder(e.target.value)}
                            className="new-input"
                            placeholder="Ex: Paris, Lyon, 75001..."
                        />
                        {geocodeStatus && <span className="new-geocode-status">{geocodeStatus}</span>}
                    </div>
                    <div className="new-champ">
                        <label>Photo</label>
                        <label className="new-upload-zone">
                            {imagePreview ? (
                                <img src={imagePreview} alt="aperçu" className="new-upload-preview" />
                            ) : (
                                <span className="new-upload-placeholder">
                                    <span className="new-upload-icon">↑</span>
                                    <span>Cliquer pour choisir une photo</span>
                                    <span className="new-upload-hint">JPG, PNG, WebP — max 10 Mo</span>
                                </span>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="new-upload-input" />
                        </label>
                        {imageUploading && <span className="new-geocode-status">Upload en cours...</span>}
                    </div>
                    <button type="submit" className="new-btn">Enregistrer les modifications</button>
                </form>
            </div>
        </div>
    )
}

export default EditExperience
