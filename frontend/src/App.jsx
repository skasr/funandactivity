import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Detail from "./pages/Detail"
import Dashboard from "./pages/Dashboard"
import NewExperience from "./pages/NewExperience"
import EditExperience from "./pages/EditExperience"
import NotFound from "./pages/NotFound"
import Chatbot from "./components/Chatbot"

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/experience/:id" element={<Detail />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/nouvelle-experience" element={
                        <ProtectedRoute>
                            <NewExperience />
                        </ProtectedRoute>
                    } />
                    <Route path="/modifier-experience/:id" element={
                        <ProtectedRoute>
                            <EditExperience />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Chatbot />
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App