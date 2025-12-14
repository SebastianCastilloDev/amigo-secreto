"use client";

import { useState, useEffect } from "react";

interface UseAutenticacionReturn {
    autenticado: boolean;
    verificandoAuth: boolean;
    password: string;
    setPassword: (password: string) => void;
    errorAuth: string;
    verificando: boolean;
    intentosFallidos: number;
    passwordsIntentadas: string[];
    verificarPassword: (e: React.FormEvent) => Promise<boolean>;
    cerrarSesion: () => void;
}

export function useAutenticacion(
    onAutenticado: () => void,
    onHackeoActivado: () => void
): UseAutenticacionReturn {
    const [autenticado, setAutenticado] = useState(false);
    const [verificandoAuth, setVerificandoAuth] = useState(true);
    const [password, setPassword] = useState("");
    const [errorAuth, setErrorAuth] = useState("");
    const [verificando, setVerificando] = useState(false);
    const [intentosFallidos, setIntentosFallidos] = useState(0);
    const [passwordsIntentadas, setPasswordsIntentadas] = useState<string[]>([]);

    useEffect(() => {
        const sesion = sessionStorage.getItem("admin_auth");
        if (sesion === "true") {
            setAutenticado(true);
            onAutenticado();
        }
        setVerificandoAuth(false);
    }, []);

    async function verificarPassword(e: React.FormEvent): Promise<boolean> {
        e.preventDefault();
        if (!password.trim() || verificando) return false;

        setVerificando(true);
        setErrorAuth("");

        try {
            const respuesta = await fetch("/api/admin/verificar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (respuesta.ok) {
                sessionStorage.setItem("admin_auth", "true");
                setAutenticado(true);
                onAutenticado();
                return true;
            } else {
                const nuevosIntentos = intentosFallidos + 1;
                setIntentosFallidos(nuevosIntentos);
                setPasswordsIntentadas(prev => [...prev, password]);

                if (nuevosIntentos >= 2) {
                    onHackeoActivado();
                } else {
                    setErrorAuth("Contraseña incorrecta");
                }
                return false;
            }
        } catch {
            setErrorAuth("Error de conexión");
            return false;
        } finally {
            setVerificando(false);
        }
    }

    function cerrarSesion() {
        sessionStorage.removeItem("admin_auth");
        setAutenticado(false);
        setPassword("");
    }

    return {
        autenticado,
        verificandoAuth,
        password,
        setPassword,
        errorAuth,
        verificando,
        intentosFallidos,
        passwordsIntentadas,
        verificarPassword,
        cerrarSesion,
    };
}
