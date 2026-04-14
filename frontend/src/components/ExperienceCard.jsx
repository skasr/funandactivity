import { useNavigate } from "react-router-dom"

function ExperienceCard({ experience }) {
    const navigate = useNavigate()

    return (
        <div style={styles.card} onClick={() => navigate("/experience/" + experience.id)}>
            <img
                src={experience.image_url || "https://placehold.co/400x200?text=Pas+de+photo"}
                alt={experience.titre}
                style={styles.img}
            />
            <div style={styles.body}>
                <p style={styles.categorie}>{experience.categorie}</p>
                <h3 style={styles.titre}>{experience.titre}</h3>
                <p style={styles.lieu}>{experience.localisation}</p>
                <p style={styles.prix}>{experience.prix} € / personne</p>
                <p style={styles.hote}>Proposé par {experience.hote_nom}</p>
            </div>
        </div>
    )
}

const styles = {
    card: {
        border: "1px solid #ddd",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s",
        backgroundColor: "white"
    },
    img: {
        width: "100%",
        height: "180px",
        objectFit: "cover"
    },
    body: {
        padding: "12px"
    },
    categorie: {
        fontSize: "12px",
        color: "#ff385c",
        fontWeight: "bold",
        margin: "0 0 4px"
    },
    titre: {
        margin: "0 0 4px",
        fontSize: "16px"
    },
    lieu: {
        fontSize: "13px",
        color: "#666",
        margin: "0 0 6px"
    },
    prix: {
        fontWeight: "bold",
        margin: "0 0 4px"
    },
    hote: {
        fontSize: "12px",
        color: "#888",
        margin: 0
    }
}

export default ExperienceCard