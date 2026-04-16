import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { useNavigate } from "react-router-dom"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "./MapView.css"

// Fix l'icône par défaut de Leaflet (bug webpack/vite)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Recentre la carte quand les expériences changent
function AutoBounds({ experiences }) {
    const map = useMap()
    useEffect(() => {
        const points = experiences.filter(e => e.latitude && e.longitude)
        if (points.length === 0) return
        if (points.length === 1) {
            map.setView([points[0].latitude, points[0].longitude], 11)
        } else {
            const bounds = L.latLngBounds(points.map(e => [e.latitude, e.longitude]))
            map.fitBounds(bounds, { padding: [40, 40] })
        }
    }, [experiences])
    return null
}

function MapView({ experiences }) {
    const navigate = useNavigate()
    const avecCoords = experiences.filter(e => e.latitude && e.longitude)

    return (
        <div className="mapview-wrapper">
            {avecCoords.length === 0 ? (
                <div className="mapview-vide">
                    <p>Aucune expérience avec des coordonnées à afficher.</p>
                    <p className="mapview-vide-sub">Les expériences apparaissent sur la carte une fois leur localisation géocodée.</p>
                </div>
            ) : (
                <MapContainer
                    center={[46.5, 2.5]}
                    zoom={6}
                    className="mapview-carte"
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <AutoBounds experiences={avecCoords} />
                    {avecCoords.map(exp => (
                        <Marker key={exp.id} position={[exp.latitude, exp.longitude]}>
                            <Popup className="mapview-popup">
                                <div className="mapview-popup-contenu">
                                    {exp.image_url && (
                                        <img src={exp.image_url} alt={exp.titre} className="mapview-popup-img" />
                                    )}
                                    <div className="mapview-popup-infos">
                                        <span className="mapview-popup-categorie">{exp.categorie}</span>
                                        <strong className="mapview-popup-titre">{exp.titre}</strong>
                                        <span className="mapview-popup-lieu">📍 {exp.localisation}</span>
                                        <span className="mapview-popup-prix">{exp.prix} € / pers.</span>
                                        <button
                                            className="mapview-popup-btn"
                                            onClick={() => navigate("/experience/" + exp.id)}
                                        >
                                            Voir l'expérience
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            )}
        </div>
    )
}

export default MapView
