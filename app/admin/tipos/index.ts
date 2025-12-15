export interface Participante {
    id: number;
    nombre: string;
    token?: string;
    amigoSecreto?: string | null;
}

export interface DatosDispositivo {
    navegador: string;
    plataforma: string;
    idioma: string;
    pantalla: string;
    zonaHoraria: string;
    bateria: string;
    conexion: string;
    ubicacion: string;
}

export interface Coordenadas {
    lat: number;
    lon: number;
}

export interface Incidente {
    id: number;
    fecha: string;
    ip: string | null;
    ubicacion: string | null;
    latitud: number | null;
    longitud: number | null;
    plataforma: string | null;
    navegador: string | null;
    foto: string | null;
    passwords: string[];
    intentos: number;
}
