// src/App.tsx
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import TTPage from "./pages/TTPage";
import MyProposalsPage from "./pages/MyProposalsPage";
import LoginPage from "./pages/LoginPage";
import {useAuth} from "./context/AuthContext";
import SignupPage from "./pages/SignupPage";

const App: React.FC = () => {
    const {user} = useAuth();

    return (
        <Router>
            <Navbar/>
            <Routes>
                {/* Ruta base: redirige a /tts */}
                <Route path="/" element={<Navigate to="/tts"/>}/>

                {/* TTPage visible para todos */}
                <Route path="/tts/*" element={<TTPage/>}/>

                {/* MyProposalsPage solo si NO eres "visitor" */}
                {!user.roles.includes("visitor") && (
                    <Route path="/my-proposals" element={<MyProposalsPage/>}/>
                )}

                {/* Pantalla de Login */}
                <Route path="/login" element={<LoginPage/>}/>

                {/* Pantalla de Registro */}
                {<Route path="/signup" element={<SignupPage/>}/>}

                {/* 404 */}
                <Route path="*" element={<div>404 Not Found</div>}/>
            </Routes>
        </Router>
    );
};

export default App;
