import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import "./Login.css"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [erreur, setErreur] = useState("")
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErreur("")

        try {
            const res = await axios.post("http://localhost:3000/api/auth/login", {
                email,
                password
            })
            login(res.data.user, res.data.token)
            navigate("/")
        } catch (err) {
            setErreur("Email ou mot de passe incorrect")
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-titre">Connexion</h2>
                {erreur && <p className="login-erreur">{erreur}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="login-champ">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <div className="login-champ">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Se connecter</button>
                </form>
                <p className="login-lien">Pas de compte ? <Link to="/register">S'inscrire</Link></p>
            </div>
        </div>
    )
}

export default Login