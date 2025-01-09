import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../api/api";

function SignupPage() {
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const userData = {
            nombreCompleto,
            email,
            password,
        };

        try {
            await api.post("/users", userData);
            alert("Usuario creado con éxito. Se te ha enviado un correo de confirmación, por favor revisa tu bandeja de entrada.");
            navigate("/login");
        } catch (err: any) {
            if (err.response?.status === 409) {
                alert("El email ya está en uso");
            } else {
                alert("Error al guardar el Usuario");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre Completo:</label>
                    <input
                        type="text"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Cargando..." : "¡Regístrame!"}
                </button>
            </form>
        </div>
    );
}

export default SignupPage;
