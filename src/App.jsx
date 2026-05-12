import React, { useState, useEffect, useRef, useCallback } from "react";

const INITIAL_DB = {
  areas: [
    {
      id: "pediatria", nombre: "Pediatria", icon: "👶", color: "#1A5276",
      casos: [
        {
          id: "p1", titulo: "Neumonia Infantil",
          caso: "Nino de 2 anos con fiebre de 39.2 grados, tos productiva de 3 dias y dificultad respiratoria progresiva. Frecuencia respiratoria: 52 por minuto, frecuencia cardiaca: 128 por minuto, saturacion de oxigeno: 91 por ciento, tiraje intercostal positivo.",
          preguntas: [
            { texto: "Cual es el diagnostico probable segun criterios AIEPI?", respuesta: "Neumonia grave segun criterios AIEPI por frecuencia respiratoria elevada, fiebre y dificultad respiratoria.", puntaje: 3 },
            { texto: "Que signo clinico indica mayor gravedad?", respuesta: "El tiraje intercostal positivo con saturacion de oxigeno de 91 por ciento indica compromiso respiratorio grave con hipoxemia.", puntaje: 3 },
            { texto: "Cual es la primera intervencion de enfermeria prioritaria?", respuesta: "Administrar oxigeno para mantener saturacion mayor a 95 por ciento, controlar signos vitales y referir urgente segun protocolo AIEPI.", puntaje: 4 }
          ]
        },
        {
          id: "p2", titulo: "Deshidratacion por Diarrea",
          caso: "Lactante de 8 meses con diarrea liquida desde hace 48 horas. Ojos hundidos, llanto sin lagrimas, mucosas secas, signo del pliegue positivo. Temperatura: 37.8 grados, frecuencia cardiaca: 140 por minuto.",
          preguntas: [
            { texto: "Cual es el grado de deshidratacion segun clasificacion OMS?", respuesta: "Deshidratacion moderada con al menos 2 signos como ojos hundidos, llanto sin lagrimas y pliegue positivo.", puntaje: 3 },
            { texto: "Cuales son los dos signos clinicos mas relevantes?", respuesta: "Ojos hundidos y signo del pliegue cutaneo positivo que tarda mas de 2 segundos en volver.", puntaje: 3 },
            { texto: "Cual es el tratamiento de rehidratacion indicado?", respuesta: "Plan B con Sales de Rehidratacion Oral, 75 mililitros por kilo en 4 horas con control estricto cada 30 minutos.", puntaje: 4 }
          ]
        },
        {
          id: "p3", titulo: "Crisis Convulsiva Febril",
          caso: "Nino de 3 anos con antecedente de convulsion febril previa. Episodio tonico-clonico generalizado de 2 minutos asociado a fiebre de 39.5 grados. Al llegar esta somnoliento pero reactivo.",
          preguntas: [
            { texto: "Como se clasifica este episodio convulsivo?", respuesta: "Convulsion febril simple: duracion menor a 15 minutos, generalizada, sin focalidad neurologica y unica en 24 horas.", puntaje: 4 },
            { texto: "Cual es la posicion de seguridad inmediata?", respuesta: "Posicion lateral de seguridad para evitar broncoaspiracion y mantener via aerea permeable.", puntaje: 3 },
            { texto: "Que intervenciones realiza enfermeria para controlar la fiebre?", respuesta: "Administrar paracetamol 15 miligramos por kilo via rectal, bano tibio y monitorizar temperatura cada 30 minutos.", puntaje: 3 }
          ]
        }
      ]
    },
    {
      id: "gineco", nombre: "Ginecoobstetricia", icon: "🤱", color: "#6C3483",
      casos: [
        {
          id: "g1", titulo: "Preeclampsia Severa",
          caso: "Gestante de 34 semanas, primigesta de 28 anos. Presion arterial: 165 sobre 108 milimetros de mercurio, cefalea intensa, vision borrosa, epigastralgia. Edema en miembros inferiores y cara. Proteinuria positiva.",
          preguntas: [
            { texto: "Cual es el diagnostico y como se diferencia de la preeclampsia leve?", respuesta: "Preeclampsia severa: presion arterial mayor o igual a 160 sobre 110 con proteinuria y sintomas como cefalea y alteraciones visuales.", puntaje: 3 },
            { texto: "Cual es el riesgo materno fetal mas grave e inmediato?", respuesta: "Riesgo de eclampsia con convulsiones, sindrome HELLP y desprendimiento prematuro de placenta.", puntaje: 3 },
            { texto: "Cuales son las intervenciones de enfermeria prioritarias?", respuesta: "Control estricto de presion arterial cada 15 minutos, canalizar via venosa, preparar sulfato de magnesio y referencia urgente.", puntaje: 4 }
          ]
        },
        {
          id: "g2", titulo: "Hemorragia Postparto",
          caso: "Puerpera de 25 anos, 30 minutos postparto vaginal. Sangrado abundante mayor a 500 mililitros, utero blando y mal contraido. Presion arterial: 90 sobre 60, frecuencia cardiaca: 118 por minuto, palidez intensa.",
          preguntas: [
            { texto: "Cual es el diagnostico y su causa mas probable?", respuesta: "Hemorragia postparto primaria por atonia uterina, que es la causa mas frecuente en el 80 por ciento de los casos.", puntaje: 3 },
            { texto: "Cual es la maniobra mecanica de primera linea?", respuesta: "Masaje uterino bimanual externo con compresion firme del fondo uterino para estimular la contraccion.", puntaje: 3 },
            { texto: "Cuales son las intervenciones inmediatas en orden de prioridad?", respuesta: "Masaje uterino, canalizar 2 vias venosas, administrar oxitocina, monitorizar signos vitales y preparar para intervencion quirurgica.", puntaje: 4 }
          ]
        }
      ]
    },
    {
      id: "quirurgica", nombre: "Instrumentacion Quirurgica", icon: "🏥", color: "#1E8449",
      casos: [
        {
          id: "q1", titulo: "Conteo Incorrecto de Gasas",
          caso: "Durante cierre de laparotomia exploradora, el conteo inicial fue de 20 gasas. Al conteo final solo hay 19 gasas. El cirujano esta listo para suturar la fascia.",
          preguntas: [
            { texto: "Cual es la accion inmediata que debe tomar la instrumentadora?", respuesta: "Suspender inmediatamente el cierre e informar al cirujano del conteo incorrecto de forma clara y firme.", puntaje: 4 },
            { texto: "Que protocolo debe activarse ante un conteo incorrecto?", respuesta: "Reconteo sistematico en campo, instrumental y residuos, y solicitar radiografia intraoperatoria si no se localiza la gasa.", puntaje: 3 },
            { texto: "Como se documenta este evento en el registro quirurgico?", respuesta: "Registrar hora de conteo, discrepancia detectada, acciones tomadas y resolucion del incidente con firma del equipo.", puntaje: 3 }
          ]
        },
        {
          id: "q2", titulo: "Accidente Biologico por Pinchazo",
          caso: "Durante una appendicectomia, la instrumentadora sufre pinchazo con aguja de sutura usada en tejido del paciente. El paciente tiene antecedente de Hepatitis B.",
          preguntas: [
            { texto: "Cual es la primera accion inmediata tras el accidente?", respuesta: "Lavado inmediato y abundante con agua y jabon por minimo 5 minutos, luego aplicar antiseptico. No succionar con la boca.", puntaje: 4 },
            { texto: "Que protocolo institucional debe activarse?", respuesta: "Notificar al jefe de servicio, acudir a urgencias y tomar muestra serologica basal del accidentado y del paciente fuente.", puntaje: 3 },
            { texto: "Cuales son las acciones de seguimiento post exposicion?", respuesta: "Seguimiento serologico a 6 semanas, 3 y 6 meses, evaluar profilaxis post exposicion al VIH dentro de 2 horas e iniciar vacunacion contra Hepatitis B.", puntaje: 3 }
          ]
        }
      ]
    },
    {
      id: "materno", nombre: "Materno Infantil", icon: "👩‍👦", color: "#B7950B",
      casos: [
        {
          id: "m1", titulo: "Tecnica de Lactancia Materna",
          caso: "Madre primipara de 19 anos, dia 3 postparto. Dolor intenso en pezones al amamantar. El bebe succiona solo el pezon sin abarcar la areola, madre en posicion encorvada.",
          preguntas: [
            { texto: "Cual es el problema identificado en la tecnica de lactancia?", respuesta: "Mala tecnica de agarre: el bebe succiona solo el pezon sin incluir la areola, causando dolor y produccion insuficiente de leche.", puntaje: 3 },
            { texto: "Como se corrige la posicion y el agarre del bebe?", respuesta: "Madre erguida con espalda apoyada, bebe alineado abdomen contra abdomen, boca amplia abarcando pezon mas areola con labios evertidos hacia afuera.", puntaje: 4 },
            { texto: "Que educacion brinda enfermeria sobre los beneficios de la lactancia exclusiva?", respuesta: "Proteccion contra infecciones, reduce alergias y obesidad, fortalece vinculo materno infantil y reduce riesgo de cancer de mama materno.", puntaje: 3 }
          ]
        },
        {
          id: "m2", titulo: "Asfixia Neonatal",
          caso: "Recien nacido con circular de cordon doble al cuello. Al nacer no respira, no llora, hipotonico, coloracion palida azulada. Frecuencia cardiaca: 50 por minuto. Apgar al minuto: 1 de 10.",
          preguntas: [
            { texto: "Cual es el diagnostico y como se clasifica la severidad?", respuesta: "Asfixia neonatal severa: Apgar 1 de 10 con frecuencia cardiaca menor a 60, apnea e hipotonia generalizada.", puntaje: 4 },
            { texto: "Cuales son los pasos inmediatos de reanimacion neonatal?", respuesta: "Posicionar, limpiar via aerea, estimular, iniciar ventilacion con presion positiva. Si frecuencia cardiaca menor a 60: masaje cardiaco e intubacion con adrenalina.", puntaje: 3 },
            { texto: "Cual es el criterio para iniciar masaje cardiaco externo en el neonato?", respuesta: "Frecuencia cardiaca menor a 60 por minuto despues de 30 segundos de ventilacion con presion positiva efectiva. Tecnica de 2 pulgares, relacion 3 a 1.", puntaje: 3 }
          ]
        }
      ]
    },
    {
      id: "primeros", nombre: "Primeros Auxilios", icon: "🚑", color: "#922B21",
      casos: [
        {
          id: "a1", titulo: "Paro Cardiorrespiratorio",
          caso: "Hombre de 60 anos colapsa en la via publica. Inconsciente, sin respuesta a estimulos, sin respiracion normal. No se palpa pulso carotideo en 10 segundos. No hay desfibrilador visible.",
          preguntas: [
            { texto: "Cuales son los criterios para confirmar el paro cardiorespiratorio?", respuesta: "Inconsciencia, ausencia de respiracion normal y ausencia de pulso en 10 segundos. Activar servicio de emergencias, iniciar RCP y conseguir desfibrilador.", puntaje: 3 },
            { texto: "Cual es la secuencia correcta de RCP basica del adulto segun la AHA 2020?", respuesta: "Secuencia C A B: 30 compresiones toracicas de 5 a 6 centimetros a 100 a 120 por minuto mas 2 ventilaciones, relacion 30 a 2 minimizando interrupciones.", puntaje: 4 },
            { texto: "Como se usa el desfibrilador si llega disponible?", respuesta: "Encender, colocar electrodos, alejarse para analisis del ritmo, aplicar descarga si indica y reanudar RCP inmediatamente despues sin verificar pulso.", puntaje: 3 }
          ]
        },
        {
          id: "a2", titulo: "Obstruccion de Via Aerea",
          caso: "Adulto de 52 anos en restaurante se lleva las manos al cuello, no puede hablar ni respirar, esta completamente cianotico con movimientos respiratorios ineficaces.",
          preguntas: [
            { texto: "Como se diferencia la obstruccion completa de la incompleta?", respuesta: "Obstruccion completa: incapacidad total para hablar, toser o respirar con cianosis. Incompleta: hay tos efectiva y puede emitir sonidos.", puntaje: 3 },
            { texto: "Cual es la maniobra de primera eleccion y como se realiza?", respuesta: "Maniobra de Heimlich: punio entre el ombligo y el apendice xifoides, compresiones bruscas hacia adentro y arriba hasta expulsar el cuerpo extrano.", puntaje: 4 },
            { texto: "Que hacer si el paciente pierde la conciencia durante el atragantamiento?", respuesta: "Recostarlo, llamar al servicio de emergencias, iniciar RCP con compresiones toracicas y revisar boca antes de cada ventilacion para extraer el cuerpo extrano visible.", puntaje: 3 }
          ]
        }
      ]
    }
  ]
};

const ADMIN_PIN = "1234";

// Funcion de voz mejorada
function speak(text, onEnd) {
  if (!window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }
  window.speechSynthesis.cancel();
  
  const trySpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    
    // Buscar voz en espanol
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => 
      v.lang.startsWith("es") && !v.name.includes("Google")
    ) || voices.find(v => v.lang.startsWith("es")) || null;
    
    if (spanishVoice) utterance.voice = spanishVoice;
    
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => { if (onEnd) onEnd(); };
    
    window.speechSynthesis.speak(utterance);
  };

  // Esperar que las voces carguen
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = trySpeak;
  } else {
    trySpeak();
  }
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

// Llamada a la API de Claude
async function callClaude(prompt) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }]
      })
    });
    
    if (!response.ok) throw new Error("Error en la API");
    
    const data = await response.json();
    const text = data.content.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
    return text;
  } catch (error) {
    console.error("Error Claude:", error);
    throw error;
  }
}

// Evaluacion de respuesta del estudiante
async function evaluarRespuesta(pregunta, respuestaEsperada, respuestaEstudiante) {
  try {
    const prompt = `Eres un evaluador experto en enfermeria. Evalua si la respuesta del estudiante es correcta comparandola con la respuesta esperada.

PREGUNTA: ${pregunta}
RESPUESTA ESPERADA: ${respuestaEsperada}
RESPUESTA DEL ESTUDIANTE: ${respuestaEstudiante}

INSTRUCCIONES:
- Si el estudiante menciona los conceptos clave aunque no use palabras exactas, considera CORRECTO
- Si la respuesta es parcialmente correcta pero falta informacion importante, considera INCORRECTO
- Responde UNICAMENTE con este JSON, sin texto adicional ni backticks:

{"correcto": true, "mensaje_voz": "Correcto. Muy bien, identificaste correctamente el diagnostico.", "retroalimentacion": "Explicacion breve de por que es correcto o que le falto."}`;

    const texto = await callClaude(prompt);
    return JSON.parse(texto);
  } catch {
    return {
      correcto: false,
      mensaje_voz: "No pude evaluar la respuesta. Intenta de nuevo.",
      retroalimentacion: "Error de conexion. Verifica tu internet."
    };
  }
}

// Consulta modo general
async function consultarSintomas(sintomas) {
  try {
    const prompt = `Eres un asistente de orientacion en salud. Analiza los sintomas descritos y brinda orientacion basica.

SINTOMAS DESCRITOS: ${sintomas}

Responde UNICAMENTE con este JSON, sin texto adicional ni backticks:

{"condicion": "Nombre de la posible condicion", "descripcion": "Descripcion breve en 2 oraciones.", "recomendaciones": ["Primera recomendacion practica", "Segunda recomendacion practica", "Tercera recomendacion practica"], "urgencia": "baja", "mensaje_voz": "Mensaje completo de 3 oraciones para leer en voz alta. Describe la posible condicion, las recomendaciones principales y termina diciendo que deben consultar a un medico profesional para un diagnostico certero."}

Para urgencia usa: baja, media o alta segun la gravedad de los sintomas.`;

    const texto = await callClaude(prompt);
    return JSON.parse(texto);
  } catch {
    return {
      condicion: "Error de conexion",
      descripcion: "No se pudo procesar la consulta en este momento.",
      recomendaciones: ["Consulte a un medico profesional", "Llame a urgencias si es grave", "No se automedique"],
      urgencia: "media",
      mensaje_voz: "No se pudo procesar su consulta. Por favor consulte a un profesional de salud para recibir orientacion medica adecuada."
    };
  }
}

// Guardar y cargar datos
async function guardarDB(db) {
  try { await window.storage.set("loyolasim_db_v3", JSON.stringify(db)); } catch {}
}
async function cargarDB() {
  try {
    const r = await window.storage.get("loyolasim_db_v3");
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}
async function guardarHistorial(h) {
  try { await window.storage.set("loyolasim_hist_v3", JSON.stringify(h)); } catch {}
}
async function cargarHistorial() {
  try {
    const r = await window.storage.get("loyolasim_hist_v3");
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
}

// Componente principal
export default function App() {
  const [vista, setVista] = useState("inicio");
  const [db, setDB] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [toast, setToast] = useState(null);
  const [adminOk, setAdminOk] = useState(false);

  useEffect(() => {
    (async () => {
      const dbGuardada = await cargarDB();
      setDB(dbGuardada || INITIAL_DB);
      const hist = await cargarHistorial();
      setHistorial(hist);
    })();
  }, []);

  const actualizarDB = async (nuevaDB) => {
    setDB(nuevaDB);
    await guardarDB(nuevaDB);
  };

  const agregarHistorial = async (entrada) => {
    const nuevo = [entrada, ...historial].slice(0, 30);
    setHistorial(nuevo);
    await guardarHistorial(nuevo);
  };

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (!db) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0f1e",color:"#63b3ed",fontSize:"18px",fontFamily:"system-ui,sans-serif"}}>
      Cargando LoyolaSim Clinical...
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0f1e,#0d1a2e)",fontFamily:"system-ui,sans-serif",color:"#e8eaf0"}}>
      {/* Barra de navegacion */}
      <nav style={{background:"rgba(10,15,30,0.95)",borderBottom:"1px solid rgba(99,179,237,0.15)",padding:"0 16px",display:"flex",alignItems:"center",flexWrap:"wrap",gap:"6px",minHeight:"56px",position:"sticky",top:0,zIndex:100}}>
        <div style={{marginRight:"auto",padding:"8px 0"}}>
          <div style={{fontSize:"18px",fontWeight:800,color:"#63b3ed"}}>LoyolaSim Clinical</div>
          <div style={{fontSize:"10px",color:"#3a6a8a",textTransform:"uppercase",letterSpacing:"1.5px"}}>Simulador Clinico Bolivia</div>
        </div>
        {[
          ["inicio","Inicio"],
          ["general","General"],
          ["estudiante","Estudiante"],
          ["admin", adminOk ? "Docente" : "Docente"],
          ["historial","Historial"]
        ].map(([v,l]) => (
          <button key={v} onClick={() => setVista(v)} style={{
            padding:"6px 12px",borderRadius:"16px",
            border:`1px solid ${vista===v?"rgba(99,179,237,0.6)":"rgba(255,255,255,0.08)"}`,
            background:vista===v?"rgba(99,179,237,0.15)":"transparent",
            color:vista===v?"#63b3ed":"#6a8faa",
            fontSize:"12px",fontWeight:vista===v?700:400,
            cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"
          }}>
            {l}
          </button>
        ))}
      </nav>

      {vista === "inicio" && <VistaInicio setVista={setVista} />}
      {vista === "general" && <VistaGeneral />}
      {vista === "estudiante" && <VistaEstudiante db={db} agregarHistorial={agregarHistorial} />}
      {vista === "admin" && (adminOk ? <VistaAdmin db={db} actualizarDB={actualizarDB} toast={mostrarToast} /> : <VistaPin onOk={() => setAdminOk(true)} />)}
      {vista === "historial" && <VistaHistorial historial={historial} />}

      {toast && (
        <div style={{position:"fixed",bottom:"24px",right:"24px",background:"#1a3a5c",border:"1px solid rgba(99,179,237,0.4)",borderRadius:"12px",padding:"12px 20px",fontSize:"13px",color:"#63b3ed",zIndex:999,fontFamily:"inherit"}}>
          {toast}
        </div>
      )}
    </div>
  );
}

function VistaInicio({ setVista }) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - 56px)",padding:"40px 20px",textAlign:"center"}}>
      <div style={{fontSize:"64px",marginBottom:"16px"}}>🏥</div>
      <h1 style={{fontSize:"clamp(28px,6vw,56px)",fontWeight:800,color:"#fff",lineHeight:1.1,marginBottom:"16px"}}>
        LoyolaSim<br/><span style={{color:"#63b3ed"}}>Clinical</span>
      </h1>
      <p style={{fontSize:"15px",color:"#6a8faa",maxWidth:"480px",marginBottom:"40px",lineHeight:1.7}}>
        Plataforma de simulacion clinica con inteligencia artificial para estudiantes de enfermeria. Responde con tu voz o por escrito.
      </p>
      <div style={{display:"flex",gap:"20px",flexWrap:"wrap",justifyContent:"center",maxWidth:"640px"}}>
        {[
          {v:"general",icon:"🩺",titulo:"Modo General",desc:"Describe sintomas y recibe orientacion basica en salud con respuesta por voz.",color:"#63b3ed"},
          {v:"estudiante",icon:"🎓",titulo:"Modo Estudiante",desc:"Practica casos clinicos reales con evaluacion inmediata por inteligencia artificial.",color:"#9f7aea"}
        ].map(({v,icon,titulo,desc,color}) => (
          <div key={v} onClick={() => setVista(v)}
            style={{background:`${color}12`,border:`1px solid ${color}30`,borderRadius:"20px",padding:"32px 24px",cursor:"pointer",flex:1,minWidth:"240px",maxWidth:"280px",transition:"all 0.3s",textAlign:"left"}}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderColor=`${color}60`; }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.borderColor=`${color}30`; }}>
            <div style={{fontSize:"40px",marginBottom:"12px"}}>{icon}</div>
            <div style={{fontSize:"20px",fontWeight:700,color:"#fff",marginBottom:"8px"}}>{titulo}</div>
            <div style={{fontSize:"13px",color:"#6a8faa",lineHeight:1.5,marginBottom:"16px"}}>{desc}</div>
            <div style={{fontSize:"13px",color,fontWeight:600}}>Ingresar →</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:"40px",display:"flex",gap:"28px",flexWrap:"wrap",justifyContent:"center"}}>
        {[["5","Areas Clinicas"],["10+","Casos disponibles"],["IA","Evaluacion inteligente"],["🎤","Respuesta por voz"]].map(([n,l]) => (
          <div key={l} style={{textAlign:"center"}}>
            <div style={{fontSize:"24px",fontWeight:800,color:"#63b3ed"}}>{n}</div>
            <div style={{fontSize:"11px",color:"#4a7fa5"}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function useMicrofono(onResultado) {
  const refRec = useRef(null);
  const [escuchando, setEscuchando] = useState(false);
  
  const alternar = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("El reconocimiento de voz requiere Google Chrome. Por favor usa Chrome.");
      return;
    }
    if (escuchando) {
      refRec.current?.stop();
      setEscuchando(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "es-ES";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = e => onResultado(e.results[0][0].transcript);
    rec.onend = () => setEscuchando(false);
    rec.onerror = () => setEscuchando(false);
    refRec.current = rec;
    rec.start();
    setEscuchando(true);
  }, [escuchando, onResultado]);
  
  return [escuchando, alternar];
}

function BotonMic({ escuchando, onAlternar, desactivado }) {
  return (
    <button onClick={onAlternar} disabled={desactivado}
      title={escuchando ? "Detener microfono" : "Hablar"}
      style={{
        width:"48px",height:"48px",borderRadius:"50%",
        border:`2px solid ${escuchando?"#ef4444":"rgba(99,179,237,0.5)"}`,
        background:escuchando?"rgba(239,68,68,0.15)":"rgba(99,179,237,0.1)",
        color:escuchando?"#ef4444":"#63b3ed",
        fontSize:"20px",cursor:desactivado?"not-allowed":"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",
        flexShrink:0,transition:"all 0.2s",
        animation:escuchando?"pulse 1s infinite":"none"
      }}>
      {escuchando ? "🔴" : "🎤"}
    </button>
  );
}

function VistaGeneral() {
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [leyendo, setLeyendo] = useState(false);
  
  const onResultadoVoz = useCallback(t => setTexto(p => p ? p + " " + t : t), []);
  const [escuchando, alternarMic] = useMicrofono(onResultadoVoz);

  const consultar = async () => {
    if (!texto.trim()) return;
    setCargando(true);
    setResultado(null);
    stopSpeaking();
    
    const r = await consultarSintomas(texto);
    setResultado(r);
    setCargando(false);
    
    // Leer respuesta automaticamente
    setLeyendo(true);
    speak(r.mensaje_voz, () => setLeyendo(false));
  };

  const leerDeNuevo = () => {
    if (!resultado) return;
    stopSpeaking();
    setLeyendo(true);
    speak(resultado.mensaje_voz, () => setLeyendo(false));
  };

  const coloresUrgencia = { alta:"#ef4444", media:"#f59e0b", baja:"#10b981" };
  const urgencia = resultado?.urgencia || "baja";

  return (
    <div style={{maxWidth:"680px",margin:"0 auto",padding:"32px 20px"}}>
      <h2 style={{fontSize:"28px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>Orientacion en Salud</h2>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"24px",lineHeight:1.5}}>
        Describe los sintomas que sientes. La IA te dara orientacion basica y respondera en voz alta. Esto no reemplaza la consulta medica.
      </p>

      <div style={{background:"rgba(99,179,237,0.05)",border:"1px solid rgba(99,179,237,0.2)",borderRadius:"16px",padding:"20px",marginBottom:"20px"}}>
        <textarea
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Ejemplo: Tengo fiebre de 38 grados desde hace 2 dias, dolor de cabeza intenso y no tengo apetito..."
          style={{width:"100%",background:"transparent",border:"none",color:"#e8eaf0",fontFamily:"inherit",fontSize:"15px",resize:"none",outline:"none",minHeight:"100px",lineHeight:1.6}}
        />
        <div style={{display:"flex",gap:"10px",marginTop:"12px",alignItems:"center"}}>
          <BotonMic escuchando={escuchando} onAlternar={alternarMic} />
          <button
            onClick={consultar}
            disabled={cargando || !texto.trim()}
            style={{flex:1,padding:"12px 20px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#3b82f6,#2563eb)",color:"#fff",fontFamily:"inherit",fontSize:"14px",fontWeight:600,cursor:"pointer",opacity:cargando||!texto.trim()?0.5:1,transition:"all 0.2s"}}>
            {cargando ? "Consultando a la IA..." : "Consultar →"}
          </button>
        </div>
        {escuchando && <div style={{marginTop:"8px",fontSize:"12px",color:"#ef4444",textAlign:"center"}}>Escuchando... habla ahora</div>}
      </div>

      {cargando && (
        <div style={{textAlign:"center",padding:"24px",color:"#63b3ed"}}>
          <div style={{fontSize:"32px",marginBottom:"8px"}}>🤔</div>
          Analizando sintomas...
        </div>
      )}

      {resultado && (
        <div style={{background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:"16px",padding:"24px",animation:"fadeIn 0.4s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px",flexWrap:"wrap"}}>
            <span style={{background:`${coloresUrgencia[urgencia]}20`,color:coloresUrgencia[urgencia],border:`1px solid ${coloresUrgencia[urgencia]}40`,padding:"4px 14px",borderRadius:"20px",fontSize:"11px",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>
              {urgencia==="alta" ? "⚠ Urgencia Alta" : urgencia==="media" ? "⚡ Urgencia Media" : "✓ Urgencia Baja"}
            </span>
            {leyendo && <span style={{fontSize:"12px",color:"#63b3ed"}}>🔊 Leyendo...</span>}
          </div>
          
          <div style={{fontSize:"22px",color:"#34d399",fontWeight:700,marginBottom:"8px"}}>{resultado.condicion}</div>
          <div style={{fontSize:"14px",color:"#8ab0c8",marginBottom:"16px",lineHeight:1.6}}>{resultado.descripcion}</div>
          
          <div style={{marginBottom:"16px"}}>
            {resultado.recomendaciones?.map((rec, i) => (
              <div key={i} style={{display:"flex",gap:"10px",padding:"10px 0",fontSize:"14px",color:"#b0c8dc",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                <span style={{color:"#34d399",flexShrink:0}}>→</span>{rec}
              </div>
            ))}
          </div>
          
          <div style={{padding:"12px",background:"rgba(234,179,8,0.08)",borderRadius:"8px",fontSize:"12px",color:"#ca8a04",borderLeft:"3px solid #ca8a04",marginBottom:"14px"}}>
            ⚕ Esta informacion es orientativa. Consulta siempre a un profesional de salud para diagnostico y tratamiento adecuado.
          </div>
          
          <button
            onClick={leerDeNuevo}
            disabled={leyendo}
            style={{padding:"10px 20px",borderRadius:"10px",border:"1px solid rgba(99,179,237,0.3)",background:"transparent",color:"#63b3ed",fontFamily:"inherit",fontSize:"13px",cursor:"pointer",opacity:leyendo?0.5:1}}>
            {leyendo ? "🔊 Leyendo..." : "🔊 Escuchar respuesta"}
          </button>
        </div>
      )}
    </div>
  );
}

function VistaEstudiante({ db, agregarHistorial }) {
  const [paso, setPaso] = useState("area");
  const [areaId, setAreaId] = useState(null);
  const [casoId, setCasoId] = useState(null);
  const [preguntaIdx, setPreguntaIdx] = useState(0);
  const [respuesta, setRespuesta] = useState("");
  const [respuestas, setRespuestas] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [leyendo, setLeyendo] = useState(false);

  const onResultadoVoz = useCallback(t => setRespuesta(p => p ? p + " " + t : t), []);
  const [escuchando, alternarMic] = useMicrofono(onResultadoVoz);

  const area = db.areas.find(a => a.id === areaId);
  const caso = area?.casos.find(c => c.id === casoId);
  const preguntaActual = caso?.preguntas[preguntaIdx];

  const iniciarCaso = (aid, cid) => {
    setAreaId(aid);
    setCasoId(cid);
    setPreguntaIdx(0);
    setRespuesta("");
    setRespuestas([]);
    setFeedback(null);
    setPaso("evaluacion");
    
    const c = db.areas.find(a => a.id === aid)?.casos.find(c => c.id === cid);
    if (c) {
      setTimeout(() => {
        setLeyendo(true);
        speak("Inicio de evaluacion. " + c.caso + ". Primera pregunta: " + c.preguntas[0].texto, () => setLeyendo(false));
      }, 500);
    }
  };

  const enviarRespuesta = async () => {
    if (!respuesta.trim() || !preguntaActual) return;
    setCargando(true);
    setFeedback(null);
    stopSpeaking();

    const resultado = await evaluarRespuesta(preguntaActual.texto, preguntaActual.respuesta, respuesta);
    
    const fb = {
      ...resultado,
      puntosObtenidos: resultado.correcto ? preguntaActual.puntaje : 0,
      puntosMax: preguntaActual.puntaje
    };
    
    setFeedback(fb);
    setCargando(false);
    
    // Leer resultado en voz alta
    setLeyendo(true);
    speak(resultado.mensaje_voz, () => setLeyendo(false));
  };

  const siguientePregunta = () => {
    if (!feedback || !caso) return;
    
    const nuevasRespuestas = [...respuestas, {
      ...feedback,
      pregunta: preguntaActual.texto,
      respuestaEstudiante: respuesta
    }];
    setRespuestas(nuevasRespuestas);
    
    if (preguntaIdx + 1 >= caso.preguntas.length) {
      const total = nuevasRespuestas.reduce((s, r) => s + r.puntosObtenidos, 0);
      const max = nuevasRespuestas.reduce((s, r) => s + r.puntosMax, 0);
      agregarHistorial({
        fecha: new Date().toISOString(),
        area: area.nombre,
        caso: caso.titulo,
        puntaje: total,
        maximo: max
      });
      setRespuestas(nuevasRespuestas);
      setPaso("puntaje");
      
      const porcentaje = max > 0 ? Math.round((total/max)*100) : 0;
      const mensajeFinal = porcentaje >= 80 
        ? `Felicitaciones. Obtuviste ${total} de ${max} puntos, un ${porcentaje} por ciento. Excelente desempeno.`
        : `Evaluacion completada. Obtuviste ${total} de ${max} puntos, un ${porcentaje} por ciento. Revisa los temas donde fallaste.`;
      
      setTimeout(() => {
        setLeyendo(true);
        speak(mensajeFinal, () => setLeyendo(false));
      }, 500);
    } else {
      const siguienteIdx = preguntaIdx + 1;
      setPreguntaIdx(siguienteIdx);
      setFeedback(null);
      setRespuesta("");
      
      setTimeout(() => {
        setLeyendo(true);
        speak("Siguiente pregunta: " + caso.preguntas[siguienteIdx].texto, () => setLeyendo(false));
      }, 300);
    }
  };

  if (paso === "area") return (
    <div style={{maxWidth:"800px",margin:"0 auto",padding:"32px 20px"}}>
      <h2 style={{fontSize:"28px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>Modo Estudiante</h2>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"24px"}}>Selecciona el area clinica que deseas evaluar</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"14px"}}>
        {db.areas.map(a => (
          <div key={a.id}
            onClick={() => { setAreaId(a.id); setPaso("caso"); }}
            style={{background:`${a.color}15`,border:`1px solid ${a.color}40`,borderRadius:"16px",padding:"24px 16px",cursor:"pointer",textAlign:"center",transition:"all 0.25s"}}
            onMouseEnter={e => e.currentTarget.style.transform="translateY(-3px)"}
            onMouseLeave={e => e.currentTarget.style.transform=""}>
            <div style={{fontSize:"36px",marginBottom:"10px"}}>{a.icon}</div>
            <div style={{fontSize:"13px",fontWeight:600,color:"#c8d8e8",marginBottom:"4px"}}>{a.nombre}</div>
            <div style={{fontSize:"11px",color:"#4a7fa5"}}>{a.casos.length} casos</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (paso === "caso") return (
    <div style={{maxWidth:"700px",margin:"0 auto",padding:"32px 20px"}}>
      <button onClick={() => setPaso("area")}
        style={{background:"transparent",border:"1px solid rgba(255,255,255,0.12)",color:"#6a8faa",borderRadius:"8px",padding:"7px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:"13px",marginBottom:"24px"}}>
        ← Volver
      </button>
      <h2 style={{fontSize:"24px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>{area?.nombre}</h2>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"20px"}}>Selecciona un caso clinico para iniciar la evaluacion</p>
      
      {area?.casos.length === 0 && (
        <div style={{textAlign:"center",padding:"48px",color:"#4a7fa5"}}>
          No hay casos en esta area. Agregalos desde el Panel Docente.
        </div>
      )}
      
      {area?.casos.map(c => {
        const total = c.preguntas.reduce((s, q) => s + q.puntaje, 0);
        return (
          <div key={c.id}
            onClick={() => iniciarCaso(area.id, c.id)}
            style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"18px 22px",marginBottom:"10px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.2s"}}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(99,179,237,0.08)"; e.currentTarget.style.borderColor="rgba(99,179,237,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; }}>
            <div>
              <div style={{fontSize:"14px",fontWeight:600,color:"#c8d8e8",marginBottom:"3px"}}>{c.titulo}</div>
              <div style={{fontSize:"12px",color:"#4a7fa5"}}>{c.preguntas.length} preguntas · {total} puntos totales</div>
            </div>
            <span style={{color:"#4a7fa5",fontSize:"20px"}}>›</span>
          </div>
        );
      })}
    </div>
  );

  if (paso === "evaluacion" && caso) {
    const pct = (preguntaIdx / caso.preguntas.length) * 100;
    return (
      <div style={{maxWidth:"720px",margin:"0 auto",padding:"32px 20px"}}>
        {/* Descripcion del caso */}
        <div style={{background:"rgba(99,179,237,0.06)",border:"1px solid rgba(99,179,237,0.18)",borderRadius:"16px",padding:"20px",marginBottom:"20px"}}>
          <div style={{fontSize:"18px",color:"#63b3ed",fontWeight:700,marginBottom:"10px"}}>{caso.titulo}</div>
          <div style={{fontSize:"14px",color:"#8ab0c8",lineHeight:1.7,fontStyle:"italic"}}>{caso.caso}</div>
          <button
            onClick={() => { stopSpeaking(); setLeyendo(true); speak(caso.caso, () => setLeyendo(false)); }}
            disabled={leyendo}
            style={{marginTop:"10px",background:"transparent",border:"1px solid rgba(99,179,237,0.25)",color:"#63b3ed",borderRadius:"8px",padding:"6px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:"12px"}}>
            {leyendo ? "🔊 Leyendo..." : "🔊 Escuchar caso"}
          </button>
        </div>

        {/* Barra de progreso */}
        <div style={{marginBottom:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"12px",color:"#4a7fa5",marginBottom:"6px"}}>
            <span>Pregunta {preguntaIdx+1} de {caso.preguntas.length}</span>
            <span>{Math.round(pct)}% completado</span>
          </div>
          <div style={{height:"4px",background:"rgba(255,255,255,0.08)",borderRadius:"4px",overflow:"hidden"}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,#63b3ed,#9f7aea)",borderRadius:"4px",width:pct+"%",transition:"width 0.4s"}} />
          </div>
        </div>

        {/* Pregunta */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"16px",padding:"24px"}}>
          <div style={{fontSize:"11px",color:"#4a7fa5",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"8px"}}>
            Pregunta {preguntaIdx+1}
          </div>
          <div style={{fontSize:"16px",fontWeight:500,color:"#e8eaf0",lineHeight:1.6,marginBottom:"6px"}}>
            {preguntaActual?.texto}
          </div>
          <div style={{fontSize:"12px",color:"#ca8a04",marginBottom:"20px"}}>
            Valor: {preguntaActual?.puntaje} puntos
          </div>

          {/* Area de respuesta */}
          <div style={{display:"flex",gap:"10px",alignItems:"flex-start",marginBottom:"12px"}}>
            <textarea
              value={respuesta}
              onChange={e => setRespuesta(e.target.value)}
              disabled={!!feedback}
              placeholder="Escribe tu respuesta aqui o usa el microfono para hablar..."
              style={{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"12px",padding:"14px",color:"#e8eaf0",fontFamily:"inherit",fontSize:"14px",resize:"none",outline:"none",minHeight:"100px",lineHeight:1.6,opacity:feedback?0.7:1}}
            />
            <BotonMic escuchando={escuchando} onAlternar={alternarMic} desactivado={!!feedback} />
          </div>
          
          {escuchando && <div style={{fontSize:"12px",color:"#ef4444",marginBottom:"8px",textAlign:"center"}}>🎤 Escuchando... habla ahora</div>}

          {!feedback && (
            <button
              onClick={enviarRespuesta}
              disabled={cargando || !respuesta.trim()}
              style={{width:"100%",padding:"14px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#9f7aea,#7c3aed)",color:"#fff",fontFamily:"inherit",fontSize:"15px",fontWeight:600,cursor:"pointer",opacity:cargando||!respuesta.trim()?0.4:1,transition:"all 0.2s"}}>
              {cargando ? "Evaluando con IA..." : "Enviar respuesta →"}
            </button>
          )}

          {cargando && (
            <div style={{textAlign:"center",padding:"16px",color:"#9f7aea",fontSize:"14px"}}>
              🤖 La IA esta evaluando tu respuesta...
            </div>
          )}

          {feedback && (
            <div style={{
              background:feedback.correcto?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.08)",
              border:`1px solid ${feedback.correcto?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.25)"}`,
              borderRadius:"12px",padding:"18px",marginTop:"14px"
            }}>
              <div style={{fontSize:"18px",fontWeight:700,color:feedback.correcto?"#34d399":"#f87171",marginBottom:"8px"}}>
                {feedback.correcto ? "✓ ¡Correcto!" : "✗ Incorrecto"} — {feedback.puntosObtenidos}/{feedback.puntosMax} puntos
              </div>
              <div style={{fontSize:"14px",color:"#8ab0c8",lineHeight:1.6,marginBottom:"8px"}}>
                {feedback.retroalimentacion}
              </div>
              {leyendo && <div style={{fontSize:"12px",color:"#63b3ed",marginBottom:"10px"}}>🔊 Leyendo resultado...</div>}
              <button
                onClick={siguientePregunta}
                style={{width:"100%",padding:"13px",borderRadius:"10px",border:"none",background:feedback.correcto?"linear-gradient(135deg,#10b981,#059669)":"linear-gradient(135deg,#6366f1,#4f46e5)",color:"#fff",fontFamily:"inherit",fontSize:"14px",fontWeight:600,cursor:"pointer",marginTop:"8px"}}>
                {preguntaIdx+1 >= caso.preguntas.length ? "Ver resultados finales →" : "Siguiente pregunta →"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (paso === "puntaje") {
    const total = respuestas.reduce((s, r) => s + r.puntosObtenidos, 0);
    const max = respuestas.reduce((s, r) => s + r.puntosMax, 0);
    const pct = max > 0 ? Math.round((total/max)*100) : 0;
    const color = pct>=80?"#10b981":pct>=60?"#f59e0b":"#ef4444";
    const calificacion = pct>=90?"Excelente 🏆":pct>=80?"Muy Bien ⭐":pct>=60?"Aprobado ✓":"Necesita mejorar 📚";
    
    return (
      <div style={{maxWidth:"580px",margin:"0 auto",padding:"40px 20px",textAlign:"center"}}>
        <h2 style={{fontSize:"22px",color:"#fff",marginBottom:"4px"}}>{caso?.titulo}</h2>
        <p style={{color:"#4a7fa5",fontSize:"13px",marginBottom:"28px"}}>{area?.nombre}</p>
        
        {/* Circulo de puntaje */}
        <div style={{width:"150px",height:"150px",borderRadius:"50%",margin:"0 auto 24px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`conic-gradient(${color} ${pct*3.6}deg, rgba(255,255,255,0.06) 0)`,boxShadow:`0 0 40px ${color}30`}}>
          <div style={{width:"120px",height:"120px",borderRadius:"50%",background:"#0d1a2e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:"38px",fontWeight:800,color:"#fff",lineHeight:1}}>{total}</div>
            <div style={{fontSize:"12px",color:"#4a7fa5"}}>de {max} pts</div>
          </div>
        </div>
        
        <div style={{fontSize:"22px",fontWeight:700,color,marginBottom:"6px"}}>{calificacion}</div>
        <div style={{fontSize:"14px",color:"#6a8faa",marginBottom:"28px"}}>{pct}% de respuestas correctas</div>
        
        {/* Detalle por pregunta */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"20px",marginBottom:"20px",textAlign:"left"}}>
          <div style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#4a7fa5",marginBottom:"14px"}}>Detalle por pregunta</div>
          {respuestas.map((r, i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"10px 0",borderBottom:i<respuestas.length-1?"1px solid rgba(255,255,255,0.05)":"none",gap:"10px"}}>
              <div style={{fontSize:"13px",color:"#8ab0c8",flex:1,lineHeight:1.4}}>{r.pregunta}</div>
              <div style={{fontWeight:700,fontSize:"14px",color:r.puntosObtenidos>0?"#34d399":"#f87171",flexShrink:0}}>{r.puntosObtenidos}/{r.puntosMax}</div>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 0",borderTop:"2px solid rgba(255,255,255,0.1)",marginTop:"8px"}}>
            <div style={{fontWeight:700,color:"#c8d8e8",fontSize:"15px"}}>TOTAL</div>
            <div style={{fontSize:"20px",fontWeight:800,color}}>{total}/{max}</div>
          </div>
        </div>
        
        <button onClick={() => setPaso("caso")}
          style={{width:"100%",padding:"14px",borderRadius:"30px",border:"none",background:"linear-gradient(135deg,#63b3ed,#3b82f6)",color:"#fff",fontFamily:"inherit",fontSize:"15px",fontWeight:700,cursor:"pointer",marginBottom:"10px"}}>
          Evaluar otro caso
        </button>
        <button onClick={() => setPaso("area")}
          style={{width:"100%",padding:"10px",borderRadius:"30px",border:"1px solid rgba(99,179,237,0.3)",background:"transparent",color:"#63b3ed",fontFamily:"inherit",fontSize:"14px",cursor:"pointer"}}>
          Cambiar area
        </button>
      </div>
    );
  }

  return null;
}

function VistaPin({ onOk }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  
  const verificar = () => {
    if (pin === ADMIN_PIN) onOk();
    else { setError(true); setPin(""); }
  };
  
  return (
    <div style={{maxWidth:"320px",margin:"0 auto",padding:"80px 20px",textAlign:"center"}}>
      <div style={{fontSize:"48px",marginBottom:"16px"}}>🔐</div>
      <div style={{fontSize:"22px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>Panel Docente</div>
      <div style={{fontSize:"13px",color:"#6a8faa",marginBottom:"28px",lineHeight:1.5}}>
        Ingresa tu PIN para administrar los casos clinicos de evaluacion
      </div>
      <input
        type="password"
        value={pin}
        onChange={e => { setPin(e.target.value); setError(false); }}
        onKeyDown={e => e.key === "Enter" && verificar()}
        maxLength={6}
        placeholder="••••"
        style={{width:"100%",background:"rgba(255,255,255,0.06)",border:`1px solid ${error?"#ef4444":"rgba(255,255,255,0.15)"}`,borderRadius:"12px",padding:"16px",color:"#e8eaf0",fontSize:"24px",textAlign:"center",letterSpacing:"8px",outline:"none",fontFamily:"inherit",marginBottom:"10px"}}
      />
      {error && <div style={{color:"#f87171",fontSize:"13px",marginBottom:"10px"}}>PIN incorrecto. Intenta de nuevo.</div>}
      <button onClick={verificar}
        style={{width:"100%",padding:"14px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#3b82f6,#2563eb)",color:"#fff",fontSize:"15px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
        Acceder →
      </button>
      <div style={{marginTop:"14px",fontSize:"11px",color:"#3a5a7a"}}>PIN por defecto: 1234</div>
    </div>
  );
}

function VistaAdmin({ db, actualizarDB, toast }) {
  const [tab, setTab] = useState(db.areas[0]?.id || "");
  const [abierto, setAbierto] = useState(null);
  const area = db.areas.find(a => a.id === tab);

  const actualizarCaso = (cid, campo, val) => actualizarDB({
    ...db,
    areas: db.areas.map(a => a.id !== tab ? a : {
      ...a,
      casos: a.casos.map(c => c.id !== cid ? c : { ...c, [campo]: val })
    })
  });

  const actualizarPregunta = (cid, qi, campo, val) => actualizarDB({
    ...db,
    areas: db.areas.map(a => a.id !== tab ? a : {
      ...a,
      casos: a.casos.map(c => {
        if (c.id !== cid) return c;
        const preguntas = [...c.preguntas];
        preguntas[qi] = { ...preguntas[qi], [campo]: campo === "puntaje" ? parseInt(val) || 0 : val };
        return { ...c, preguntas };
      })
    })
  });

  const agregarPregunta = (cid) => actualizarDB({
    ...db,
    areas: db.areas.map(a => a.id !== tab ? a : {
      ...a,
      casos: a.casos.map(c => c.id !== cid ? c : {
        ...c,
        preguntas: [...c.preguntas, { texto: "", respuesta: "", puntaje: 3 }]
      })
    })
  });

  const eliminarPregunta = (cid, qi) => actualizarDB({
    ...db,
    areas: db.areas.map(a => a.id !== tab ? a : {
      ...a,
      casos: a.casos.map(c => c.id !== cid ? c : {
        ...c,
        preguntas: c.preguntas.filter((_, i) => i !== qi)
      })
    })
  });

  const agregarCaso = () => {
    const id = "c" + Date.now();
    actualizarDB({
      ...db,
      areas: db.areas.map(a => a.id !== tab ? a : {
        ...a,
        casos: [...a.casos, { id, titulo: "Nuevo caso clinico", caso: "", preguntas: [{ texto: "", respuesta: "", puntaje: 3 }] }]
      })
    });
    setAbierto(id);
    toast("✓ Caso agregado correctamente");
  };

  const eliminarCaso = (cid) => {
    if (!confirm("¿Eliminar este caso? Esta accion no se puede deshacer.")) return;
    actualizarDB({
      ...db,
      areas: db.areas.map(a => a.id !== tab ? a : {
        ...a,
        casos: a.casos.filter(c => c.id !== cid)
      })
    });
    toast("✓ Caso eliminado");
  };

  const restaurar = () => {
    if (!confirm("¿Restaurar la base de datos original? Se perderan todos los cambios.")) return;
    actualizarDB(INITIAL_DB);
    toast("✓ Base de datos restaurada");
  };

  const estiloInput = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#e8eaf0",
    fontFamily: "inherit",
    fontSize: "14px",
    outline: "none",
    marginBottom: "10px"
  };

  return (
    <div style={{maxWidth:"860px",margin:"0 auto",padding:"32px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"6px",flexWrap:"wrap",gap:"10px"}}>
        <h2 style={{fontSize:"26px",fontWeight:700,color:"#fff"}}>Panel Docente</h2>
        <button onClick={restaurar}
          style={{padding:"8px 16px",borderRadius:"8px",border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#f87171",fontFamily:"inherit",fontSize:"12px",cursor:"pointer"}}>
          Restaurar original
        </button>
      </div>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"20px",lineHeight:1.5}}>
        Edita, agrega o elimina casos clinicos para cada area. Los cambios se guardan automaticamente.
      </p>

      {/* Tabs de areas */}
      <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"24px"}}>
        {db.areas.map(a => (
          <button key={a.id} onClick={() => setTab(a.id)}
            style={{padding:"8px 16px",borderRadius:"20px",border:`1px solid ${tab===a.id?a.color+"80":"rgba(255,255,255,0.1)"}`,background:tab===a.id?a.color+"20":"transparent",color:tab===a.id?"#e8eaf0":"#6a8faa",fontSize:"12px",cursor:"pointer",fontFamily:"inherit",fontWeight:tab===a.id?600:400,transition:"all 0.2s"}}>
            {a.icon} {a.nombre}
          </button>
        ))}
      </div>

      {area && (
        <>
          <button onClick={agregarCaso}
            style={{marginBottom:"16px",padding:"9px 18px",borderRadius:"10px",border:"1px solid rgba(99,179,237,0.35)",background:"transparent",color:"#63b3ed",fontFamily:"inherit",fontSize:"13px",cursor:"pointer"}}>
            + Agregar caso clinico
          </button>

          {area.casos.length === 0 && (
            <div style={{textAlign:"center",padding:"48px",color:"#4a7fa5"}}>
              No hay casos en esta area. Agrega el primero con el boton de arriba.
            </div>
          )}

          {area.casos.map(c => (
            <div key={c.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"16px 18px",marginBottom:"12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:abierto===c.id?"14px":"0",flexWrap:"wrap",gap:"8px"}}>
                <div style={{fontSize:"14px",fontWeight:600,color:"#c8d8e8"}}>📋 {c.titulo || "Sin titulo"}</div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button onClick={() => setAbierto(abierto===c.id?null:c.id)}
                    style={{padding:"5px 12px",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.12)",background:"transparent",color:"#6a8faa",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>
                    {abierto===c.id ? "Contraer ▲" : "Editar ▼"}
                  </button>
                  <button onClick={() => eliminarCaso(c.id)}
                    style={{padding:"5px 12px",borderRadius:"6px",border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#f87171",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>
                    Eliminar
                  </button>
                </div>
              </div>

              {abierto===c.id && (
                <>
                  <label style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#4a7fa5",display:"block",marginBottom:"5px"}}>Titulo del caso</label>
                  <input style={estiloInput} value={c.titulo} onChange={e => actualizarCaso(c.id, "titulo", e.target.value)} placeholder="Ejemplo: Neumonia Infantil" />
                  
                  <label style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#4a7fa5",display:"block",marginBottom:"5px"}}>Descripcion clinica del caso</label>
                  <textarea
                    style={{...estiloInput, resize:"vertical", minHeight:"80px", lineHeight:1.5, marginBottom:"14px"}}
                    value={c.caso}
                    onChange={e => actualizarCaso(c.id, "caso", e.target.value)}
                    placeholder="Describe el caso con signos vitales, sintomas y contexto clinico..."
                  />
                  
                  <label style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#4a7fa5",display:"block",marginBottom:"10px"}}>Preguntas y respuestas esperadas</label>
                  
                  {c.preguntas.map((q, qi) => (
                    <div key={qi} style={{background:"rgba(255,255,255,0.03)",borderRadius:"10px",padding:"14px",marginBottom:"10px",display:"flex",gap:"10px"}}>
                      <div style={{fontSize:"11px",color:"#4a7fa5",fontWeight:700,paddingTop:"8px",flexShrink:0,width:"22px"}}>P{qi+1}</div>
                      <div style={{flex:1}}>
                        <input style={{...estiloInput, marginBottom:"8px"}} value={q.texto} onChange={e => actualizarPregunta(c.id, qi, "texto", e.target.value)} placeholder="Pregunta de evaluacion..." />
                        <textarea
                          style={{...estiloInput, resize:"vertical", minHeight:"60px", lineHeight:1.5, marginBottom:"8px"}}
                          value={q.respuesta}
                          onChange={e => actualizarPregunta(c.id, qi, "respuesta", e.target.value)}
                          placeholder="Respuesta esperada (la IA la usara para evaluar al estudiante)"
                        />
                        <div style={{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"}}>
                          <label style={{fontSize:"12px",color:"#6a8faa",display:"flex",alignItems:"center",gap:"6px"}}>
                            Puntaje:
                            <input
                              type="number" min="1" max="10"
                              value={q.puntaje}
                              onChange={e => actualizarPregunta(c.id, qi, "puntaje", e.target.value)}
                              style={{...estiloInput, width:"60px", marginBottom:0, textAlign:"center", padding:"6px"}}
                            />
                          </label>
                          {c.preguntas.length > 1 && (
                            <button onClick={() => eliminarPregunta(c.id, qi)}
                              style={{padding:"5px 12px",borderRadius:"6px",border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#f87171",fontFamily:"inherit",fontSize:"11px",cursor:"pointer"}}>
                              Eliminar pregunta
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={() => agregarPregunta(c.id)}
                    style={{padding:"8px 16px",borderRadius:"8px",border:"1px solid rgba(99,179,237,0.3)",background:"transparent",color:"#63b3ed",fontFamily:"inherit",fontSize:"12px",cursor:"pointer"}}>
                    + Agregar pregunta
                  </button>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function VistaHistorial({ historial }) {
  if (historial.length === 0) return (
    <div style={{maxWidth:"700px",margin:"0 auto",padding:"32px 20px"}}>
      <h2 style={{fontSize:"26px",fontWeight:700,color:"#fff",marginBottom:"28px"}}>Historial de Evaluaciones</h2>
      <div style={{textAlign:"center",padding:"60px",color:"#4a7fa5"}}>
        <div style={{fontSize:"48px",marginBottom:"16px"}}>📊</div>
        No hay evaluaciones registradas aun.<br/>
        Completa una evaluacion en Modo Estudiante para verla aqui.
      </div>
    </div>
  );

  return (
    <div style={{maxWidth:"700px",margin:"0 auto",padding:"32px 20px"}}>
      <h2 style={{fontSize:"26px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>Historial de Evaluaciones</h2>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"20px"}}>{historial.length} evaluacion(es) registrada(s)</p>
      
      {historial.map((h, i) => {
        const pct = Math.round((h.puntaje/h.maximo)*100);
        const color = pct>=80?"#10b981":pct>=60?"#f59e0b":"#ef4444";
        return (
          <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"16px 20px",marginBottom:"10px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px"}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,color:"#c8d8e8",marginBottom:"4px",fontSize:"14px"}}>{h.caso}</div>
              <div style={{fontSize:"12px",color:"#4a7fa5"}}>
                {h.area} · {new Date(h.fecha).toLocaleDateString("es-BO", {day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:"20px",fontWeight:700,color}}>{h.puntaje}/{h.maximo}</div>
              <div style={{fontSize:"11px",color:"#4a7fa5"}}>{pct}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
