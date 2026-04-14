import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "./Register.css"

function Register() {
    const [nom, setNom] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("visiteur")
    const [erreur, setErreur] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErreur("")

        try {
            await axios.post("http://localhost:3000/api/auth/register", {
                nom,
                email,
                password,
                role
            })
            navigate("/login")
        } catch (err) {
            setErreur("Erreur lors de l'inscription")
        }
    }

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-titre">Inscription</h2>
                {erreur && <p className="register-erreur">{erreur}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="register-champ">
                        <label>Nom</label>
                        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="register-input" required />
                    </div>
                    <div className="register-champ">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="register-input" required />
                    </div>
                    <div className="register-champ">
                        <label>Mot de passe</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="register-input" required />
                    </div>
                    <div className="register-champ">
                        <label>Je suis</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="register-input">
                            <option value="visiteur">Visiteur (je réserve des activités)</option>
                            <option value="hote">Hôte (je propose des activités)</option>
                        </select>
                    </div>
                    <button type="submit" className="register-btn">Créer mon compte</button>
                </form>
                <p className="register-lien">Déjà un compte ? <Link to="/login">Se connecter</Link></p>
            </div>
        </div>
    )
}

export default Register