import { useEffect, useState } from "react"
import axios from "axios"
import ExperienceCard from "../components/ExperienceCard"
import "./Home.css"

function Home() {
    const [experiences, setExperiences] = useState([])
    const [categorie, setCategorie] = useState("")
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    const categories = ["Bateau", "Randonnée", "Cuisine", "Vélo", "Pêche", "Surf", "Escalade", "Kayak"]

    useEffect(() => {
        fetchExperiences()
    }, [categorie])

    const fetchExperiences = async () => {
        try {
            let url = "http://localhost:3000/api/experiences"
            const params = []
            if (categorie) params.push("categorie=" + categorie)
            if (search.trim()) params.push("search=" + encodeURIComponent(search.trim()))
            if (params.length > 0) url += "?" + params.join("&")
            const res = await axios.get(url)
            setExperiences(res.data)
        } catch (err) {
            console.log("erreur chargement experiences")
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setLoading(true)
        fetchExperiences()
    }

    return (
        <div className="home-container">
            <div className="home-hero">
                <h1 className="home-titre">Découvrez des expériences uniques</h1>
                <p className="home-sub">Activités, ateliers et aventures près de chez vous</p>
                <form className="home-recherche" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="home-recherche-input"
                        placeholder="Rechercher une activité, un lieu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="home-recherche-btn">Rechercher</button>
                </form>
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