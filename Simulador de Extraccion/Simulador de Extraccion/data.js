// Archivo de Base de Datos Falsa (Mock Data)
const mockDatabase = {
    // Ejemplo: Número con chats y multimedia
    "555-0102": {
        senderName: "Operativo Zero",
        status: "En Línea",
        timestamp: "2023-10-25 14:32:00",
        chats: [
            {
                contacto: "Carlos R.",
                numero: "+57 3135539557",
                mensajes: [
                    { hora: "14:28", texto: "¿Qué almorzaste?" },
                    { hora: "14:30", texto: "Todo en orden con los reportes financieros." }
                ]
            },
            {
                contacto: "Contacto Desconocido",
                numero: "+57 3043632542",
                mensajes: [
                    { hora: "13:41", texto: "El paquete ya llegó al punto acordado." },
                    { hora: "18:25", texto: "Perfecto, nos vemos allá a la misma hora de siempre." }
                ]
            }
        ],
        lastImageURL: "https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },

    // Ejemplo: Número sin imagen e historiales cortos
    "123456": {
        senderName: "Usuario (No guardado)",
        status: "Última vez visto hoy a las 10:15",
        timestamp: "2025-01-14 10:15:00",
        chats: [
            {
                contacto: "Alias 'M'",
                numero: "+57 3001234567",
                mensajes: [
                    { hora: "09:10", texto: "Dime qué pasó con la reunión." },
                    { hora: "10:12", texto: "Fue pospuesta para la otra semana." }
                ]
            }
        ],
        lastImageURL: null
    },

    // Ejemplo "Admin"
    "admin": {
        senderName: "SysAdmin Node",
        status: "Conexión Permanente Activa",
        timestamp: "[SISTEMA SINCRONIZADO]",
        chats: [
            {
                contacto: "System Alert",
                numero: "000-000-0000",
                mensajes: [
                    { hora: "00:00", texto: "Bienvenido al nodo de simulaciones tácticas." },
                    { hora: "00:01", texto: "Utiliza los parámetros de prueba con cuidado. Simulación Activa." }
                ]
            }
        ],
        lastImageURL: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
};
