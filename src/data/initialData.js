export const INITIAL_PATIENTS = [
  {
    id: 1,
    nombre: "Ana García López", dni: "12345678A", fechaNacimiento: "1990-05-12",
    sexo: "Mujer", telefono: "612 345 678", email: "ana@email.com",
    direccion: "Calle Mayor 14, 2ºB, Madrid", ocupacion: "Enfermera", estadoCivil: "Soltera",
    contactoEmergencia: "María López – 611 222 333",
    motivoConsulta: "Ansiedad generalizada y dificultad para dormir desde hace 2 años",
    antecedentesFamiliares: "Madre con episodios depresivos recurrentes",
    antecedentesPersonales: "Sin antecedentes relevantes. Niega tratamientos psicológicos previos.",
    medicacion: "Ninguna", modalidad: "Online", idiomasSesion: "Español",
    objetivosTerapeuticos: "Reducir la ansiedad, mejorar la calidad del sueño y el manejo del estrés",
    diagnosis: "F41.1 - Trastorno de ansiedad generalizada (TAG)",
    since: "2024-03-15", sessions: 12, status: "activo", balance: 0,
    notes: [], autorizacion: false, consentimiento: false,
  },
  {
    id: 2,
    nombre: "Carlos Mendez Ruiz", dni: "87654321B", fechaNacimiento: "1996-11-03",
    sexo: "Hombre", telefono: "698 765 432", email: "carlos@email.com",
    direccion: "Av. de la Paz 7, 1ºA, Valencia", ocupacion: "Diseñador gráfico", estadoCivil: "Soltero",
    contactoEmergencia: "Luis Mendez – 699 888 777",
    motivoConsulta: "Estado de ánimo deprimido, apatía y pérdida de motivación laboral",
    antecedentesFamiliares: "Ninguno conocido",
    antecedentesPersonales: "Episodio depresivo leve hace 3 años. Seguimiento por psiquiatra.",
    medicacion: "Sertralina 50mg (prescrita por psiquiatra, Dr. López)", modalidad: "Online",
    idiomasSesion: "Español",
    objetivosTerapeuticos: "Mejorar el estado de ánimo, recuperar motivación y habilidades conductuales",
    diagnosis: "F32.1 - Episodio depresivo mayor moderado",
    since: "2024-06-01", sessions: 8, status: "activo", balance: -80,
    notes: [], autorizacion: false, consentimiento: false,
  },
]

export const INITIAL_INVOICES = [
  { id: 1, patientId: 1, patient: "Ana García López", concept: "Sesión individual 50min", date: "2025-03-10", amount: 80, status: "pagada", method: "transferencia" },
  { id: 2, patientId: 2, patient: "Carlos Mendez Ruiz", concept: "Sesión individual 50min", date: "2025-03-12", amount: 80, status: "pendiente", method: "" },
  { id: 3, patientId: 1, patient: "Ana García López", concept: "Sesión individual 50min", date: "2025-03-17", amount: 80, status: "pagada", method: "bizum" },
]

export const INITIAL_APPOINTMENTS = [
  { id: 1, patientId: 1, patient: "Ana García López", date: "2026-03-19", time: "10:00", duration: 50, type: "individual" },
  { id: 2, patientId: 2, patient: "Carlos Mendez Ruiz", date: "2026-03-19", time: "11:00", duration: 50, type: "individual" },
  { id: 3, patientId: 1, patient: "Ana García López", date: "2026-03-26", time: "10:00", duration: 50, type: "individual" },
]
