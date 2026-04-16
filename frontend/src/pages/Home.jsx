import { useEffect, useState, useCallback, useRef } from "react"
import axios from "axios"
import ExperienceCard from "../components/ExperienceCard"
import MapView from "../components/MapView"
import "./Home.css"

function Home() {
    const [experiences, setExperiences] = useState([])
    const [categorie, setCategorie] = useState("")
    const [search, setSearch] = useState("")
    const [prixMin, setPrixMin] = useState("")
    const [prixMax, setPrixMax] = useState("")
    const [sort, setSort] = useState("recent")
    const [loading, setLoading] = useState(true)
    const [vue, setVue] = useState("grille")
    const debounceRef = useRef(null)

    const categories = ["Bateau", "Randonnée", "Cuisine", "Vélo", "Pêche", "Surf", "Escalade", "Kayak"]

    const fetchExperiences = useCallback(async (params) => {
        try {
            setLoading(true)
            const res = await axios.get("http://localhost:3000/api/experiences", { params })
            setExperiences(res.data)
        } catch (err) {
            console.log("erreur chargement experiences")
        } finally {
            setLoading(false)
        }
    }, [])

    const buildParams = useCallback((overrides = {}) => {
        const base = { categorie, search: search.trim(), prix_min: prixMin, prix_max: prixMax, sort }
        const merged = { ...base, ...overrides }
        return Object.fromEntries(Object.entries(merged).filter(([, v]) => v !== "" && v !== undefined))
    }, [categorie, search, prixMin, prixMax, sort])

    // Déclenche fetch immédiatement sur catégorie, prix, tri
    useEffect(() => {
        fetchExperiences(buildParams())
    }, [categorie, prixMin, prixMax, sort])

    // Debounce pour la recherche texte
    const handleSearchChange = (e) => {
        const val = e.target.value
        setSearch(val)
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            fetchExperiences(buildParams({ search: val.trim() }))
        }, 400)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        clearTimeout(debounceRef.current)
        fetchExperiences(buildParams())
    }

    const clearSearch = () => {
        setSearch("")
        clearTimeout(debounceRef.current)
        fetchExperiences(buildParams({ search: "" }))
    }

    const resetFiltres = () => {
        setSearch("")
        setCategorie("")
        setPrixMin("")
        setPrixMax("")
        setSort("recent")
        clearTimeout(debounceRef.current)
        fetchExperiences({})
    }

    const hasFiltres = search || categorie || prixMin || prixMax || sort !== "recent"

    return (
        <div className="home-container">
            <div className="home-hero">
                <h1 className="home-titre">Découvrez des expériences uniques</h1>
                <p className="home-sub">Activités, ateliers et aventures près de chez vous</p>
                <form className="home-recherche" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        className="home-recherche-input"
                        placeholder="Rechercher une activité, un lieu, un hôte..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                    {search && (
                        <button type="button" className="home-recherche-clear" onClick={clearSearch}>✕</button>
                    )}
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

            <div className="home-options">
                <div className="home-prix">
                    <input
                        type="number"
                        className="home-prix-input"
                        placeholder="Prix min €"
                        value={prixMin}
                        min="0"
                        onChange={(e) => setPrixMin(e.target.value)}
                    />
                    <span className="home-prix-sep">—</span>
                    <input
                        type="number"
                        className="home-prix-input"
                        placeholder="Prix max €"
                        value={prixMax}
                        min="0"
                        onChange={(e) => setPrixMax(e.target.value)}
                    />
                </div>

                <select className="home-tri" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="recent">Plus récents</option>
                    <option value="prix_asc">Prix croissant</option>
                    <option value="prix_desc">Prix décroissant</option>
                </select>

                {hasFiltres && (
                    <button className="home-reset" onClick={resetFiltres}>Réinitialiser</button>
                )}
            </div>

            <div className="home-resultats">
                {!loading && (
                    <span>{experiences.length} expérience{experiences.length !== 1 ? "s" : ""} trouvée{experiences.length !== 1 ? "s" : ""}</span>
                )}
                <div className="home-vue-toggle">
                    <button
                        className={"home-vue-btn" + (vue === "grille" ? " actif" : "")}
                        onClick={() => setVue("grille")}
                        title="Vue grille"
                    >
                        ⊞ Grille
                    </button>
                    <button
                        className={"home-vue-btn" + (vue === "carte" ? " actif" : "")}
                        onClick={() => setVue("carte")}
                        title="Vue carte"
                    >
                        🗺 Carte
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="home-loading">Chargement...</p>
            ) : experiences.length === 0 ? (
                <p className="home-vide">Aucune expérience trouvée</p>
            ) : vue === "carte" ? (
                <MapView experiences={experiences} />
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
