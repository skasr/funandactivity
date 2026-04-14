import { useEffect, useState } from "react"
import axios from "axios"
import ExperienceCard from "../components/ExperienceCard"
import "./Home.css"

function Home() {
    const [experiences, setExperiences] = useState([])
    const [categorie, setCategorie] = useState("")
    const [loading, setLoading] = useState(true)

    const categories = ["Cuisine", "Sport", "Art", "Nature", "Musique", "Bien-être"]

    useEffect(() => {
        fetchExperiences()
    }, [categorie])

    const fetchExperiences = async () => {
        try {
            const url = categorie
                ? "http://localhost:3000/api/experiences?categorie=" + categorie
                : "http://localhost:3000/api/experiences"
            const res = await axios.get(url)
            setExperiences(res.data)
        } catch (err) {
            console.log("erreur chargement experiences")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="home-container">
            <div className="home-hero">
                <h1 className="home-titre">Découvrez des expériences uniques</h1>
                <p className="home-sub">Activités, ateliers et aventures près de chez vous</p>
            </div>

            <div className="home-filtres">
                <button
                    onClick={() => setCategorie("")}
                    className={categorie === "" ? "filtre actif" : "filtre"}
                >
                    Toutes
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategorie(cat)}
                        className={categorie === cat ? "filtre actif" : "filtre"}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="home-loading">Chargement...</p>
            ) : experiences.length === 0 ? (
                <p className="home-vide">Aucune expérience trouvée</p>
            ) : (
                <div className="home-grille">
                    {experiences.map(exp => (
                        <ExperienceCard key={exp.id} experience={exp} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home