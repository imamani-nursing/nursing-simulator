import React, { useState, useEffect, useRef, useCallback } from "react";

const INITIAL_DB = {
  areas: [
    {
      id: "gineco", nombre: "Ginecoobstetricia", icon: "🤱", color: "#6C3483",
      casos: [
        {
          id: "g1", titulo: "Trabajo de Parto",
          caso: "Mujer de 24 anos con 38 semanas de embarazo llega al centro de salud con dolor abdominal cada 5 minutos y salida de liquido transparente.",
          preguntas: [{ texto: "Que signo indica que la paciente esta iniciando trabajo de parto?", respuesta: "Las contracciones frecuentes y la salida de liquido amniotico indican inicio del trabajo de parto.", puntaje: 10 }]
        },
        {
          id: "g2", titulo: "Preeclampsia",
          caso: "Gestante de 30 semanas presenta dolor de cabeza intenso, vision borrosa y presion arterial de 150 sobre 100 milimetros de mercurio.",
          preguntas: [{ texto: "Que complicacion del embarazo podria presentar la paciente?", respuesta: "La paciente podria presentar preeclampsia.", puntaje: 10 }]
        }
      ]
    },
    {
      id: "materno", nombre: "Materno Infantil", icon: "👩‍👦", color: "#B7950B",
      casos: [
        {
          id: "m1", titulo: "Lactancia Materna",
          caso: "Una madre lleva a su bebe de 4 meses al control. Refiere que solo recibe leche materna.",
          preguntas: [{ texto: "Que recomendacion se debe brindar a la madre?", respuesta: "Continuar con lactancia materna exclusiva hasta los 6 meses.", puntaje: 10 }]
        },
        {
          id: "m2", titulo: "Hipotermia Neonatal",
          caso: "Un recien nacido presenta temperatura baja, piel fria y llanto debil.",
          preguntas: [{ texto: "Que accion inmediata debe realizar enfermeria?", respuesta: "Abrigar al recien nacido y mantener calor corporal mediante contacto piel a piel.", puntaje: 10 }]
        }
      ]
    },
    {
      id: "pediatria", nombre: "Pediatria", icon: "👶", color: "#1A5276",
      casos: [
        {
          id: "p1", titulo: "Dificultad Respiratoria",
          caso: "Nino de 5 anos llega con fiebre, tos y dificultad respiratoria leve.",
          preguntas: [{ texto: "Que signo vital debe vigilarse prioritariamente?", respuesta: "La frecuencia respiratoria y la saturacion de oxigeno.", puntaje: 10 }]
        },
        {
          id: "p2", titulo: "Deshidratacion",
          caso: "Nina de 2 anos presenta diarrea y vomitos desde hace dos dias. Tiene labios secos y llora sin lagrimas.",
          preguntas: [{ texto: "Que problema presenta la paciente?", respuesta: "Presenta signos de deshidratacion.", puntaje: 10 }]
        }
      ]
    },
    {
      id: "quirurgica", nombre: "Instrumentacion Quirurgica", icon: "🏥", color: "#1E8449",
      casos: [
        {
          id: "q1", titulo: "Conteo de Gasas",
          caso: "Durante una cirugia el instrumentador nota que falta una gasa del conteo inicial.",
          preguntas: [{ texto: "Que debe hacer inmediatamente?", respuesta: "Informar al equipo quirurgico y realizar un nuevo conteo antes de cerrar la cirugia.", puntaje: 10 }]
        },
        {
          id: "q2", titulo: "Esterilizacion",
          caso: "Antes de iniciar una cirugia el personal verifica la esterilidad del instrumental.",
          preguntas: [{ texto: "Por que es importante la esterilizacion?", respuesta: "Porque previene infecciones y contaminacion del paciente.", puntaje: 10 }]
        }
      ]
    },
    {
      id: "primeros", nombre: "Primeros Auxilios", icon: "🚑", color: "#922B21",
      casos: [
        {
          id: "a1", titulo: "Hemorragia",
          caso: "Un joven cae de una motocicleta y presenta sangrado abundante en el brazo.",
          preguntas: [{ texto: "Que accion de primeros auxilios debe realizarse primero?", respuesta: "Aplicar presion directa sobre la herida para controlar el sangrado.", puntaje: 10 }]
        },
        {
          id: "a2", titulo: "Paciente Inconsciente",
          caso: "Una persona pierde el conocimiento en la calle pero respira normalmente.",
          preguntas: [{ texto: "En que posicion debe colocarse al paciente?", respuesta: "Debe colocarse en posicion lateral de seguridad.", puntaje: 10 }]
        }
      ]
    }
  ]
};
const ADMIN_PIN = "1234";

let vocesListas = false;
let mejorVozES = null;

function inicializarVoces() {
  if (vocesListas) return;
  const actualizar = () => {
    const voces = window.speechSynthesis.getVoices();
    const prioridad = ["Microsoft Sabina", "Microsoft Laura", "Microsoft Helena", "Google espanol", "Google Spanish", "Paulina", "Monica", "Jorge", "Diego"];
    for (const nombre of prioridad) {
      const voz = voces.find(v => v.name.includes(nombre) || v.lang.startsWith(nombre));
      if (voz) { mejorVozES = voz; break; }
    }
    if (!mejorVozES) mejorVozES = voces.find(v => v.lang.startsWith("es")) || null;
    vocesListas = true;
  };
  if (window.speechSynthesis.getVoices().length > 0) actualizar();
  else window.speechSynthesis.onvoiceschanged = actualizar;
}

function hablar(texto, alTerminar) {
  if (!window.speechSynthesis) { if (alTerminar) alTerminar(); return; }
  window.speechSynthesis.cancel();
  inicializarVoces();
  const ejecutar = () => {
    const utt = new SpeechSynthesisUtterance(texto);
    utt.lang = "es-ES";
    utt.rate = 0.85;
    utt.pitch = 1.05;
    utt.volume = 1;
    if (mejorVozES) utt.voice = mejorVozES;
    if (alTerminar) utt.onend = alTerminar;
    utt.onerror = () => { if (alTerminar) alTerminar(); };
    window.speechSynthesis.speak(utt);
  };
  if (vocesListas) ejecutar();
  else setTimeout(ejecutar, 300);
}

function detenerVoz() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

async function llamarClaude(prompt) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 300, messages: [{ role: "user", content: prompt }] })
  });
  if (!resp.ok) throw new Error("Error API");
  const d = await resp.json();
  return d.content.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
}

async function evaluarRespuesta(pregunta, respuestaEsperada, respuestaEstudiante) {
  try {
    const txt = await llamarClaude(`Eres evaluador de enfermeria. Evalua si la respuesta es correcta.
PREGUNTA: ${pregunta}
RESPUESTA ESPERADA: ${respuestaEsperada}
RESPUESTA ESTUDIANTE: ${respuestaEstudiante}
Si menciona los conceptos clave aunque use otras palabras es CORRECTO.
Responde SOLO con este JSON sin backticks:
{"correcto": true, "mensaje_voz": "Correcto, muy bien.", "recomendacion": "Breve recomendacion de estudio de 1 linea."}`);
    return JSON.parse(txt);
  } catch {
    return { correcto: false, mensaje_voz: "No pude evaluar. Intenta de nuevo.", recomendacion: "Revisa el tema e intenta nuevamente." };
  }
}

async function consultarSintomas(sintomas) {
  try {
    const txt = await llamarClaude(`Eres asistente de salud. Analiza estos sintomas brevemente: ${sintomas}
Responde SOLO con este JSON sin backticks:
{"condicion": "Posible condicion", "descripcion": "Descripcion breve de 1 oracion.", "recomendaciones": ["Rec 1", "Rec 2", "Rec 3"], "urgencia": "baja", "mensaje_voz": "2 oraciones explicando la condicion y que deben consultar a un medico."}`);
    return JSON.parse(txt);
  } catch {
    return { condicion: "Sin conexion", descripcion: "No se pudo procesar.", recomendaciones: ["Consulte a un medico", "No se automedique", "Llame a urgencias si es grave"], urgencia: "media", mensaje_voz: "No pude procesar su consulta. Por favor consulte a un profesional de salud." };
  }
}

const guardar = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} };
const cargar = async (k, def) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : def; } catch { return def; } };

export default function App() {
  const [vista, setVista] = useState("inicio");
  const [db, setDB] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [toast, setToast] = useState(null);
  const [adminOk, setAdminOk] = useState(false);

  useEffect(() => {
    inicializarVoces();
    (async () => {
      setDB(await cargar("loyolasim_v5_db", INITIAL_DB));
      setHistorial(await cargar("loyolasim_v5_hist", []));
    })();
  }, []);

  const actualizarDB = async n => { setDB(n); await guardar("loyolasim_v5_db", n); };
  const agregarHist = async e => {
    const nuevo = [e, ...historial].slice(0, 30);
    setHistorial(nuevo);
    await guardar("loyolasim_v5_hist", nuevo);
  };
  const mostrarToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  if (!db) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0f1e", color: "#63b3ed", fontFamily: "system-ui,sans-serif", fontSize: "18px" }}>
      Cargando LoyolaSim Clinical...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e,#0d1a2e)", fontFamily: "system-ui,sans-serif", color: "#e8eaf0" }}>
      <nav style={{ background: "rgba(10,15,30,0.95)", borderBottom: "1px solid rgba(99,179,237,0.15)", padding: "0 16px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px", minHeight: "56px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ marginRight: "auto", padding: "8px 0" }}>
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#63b3ed" }}>LoyolaSim Clinical</div>
          <div style={{ fontSize: "10px", color: "#3a6a8a", textTransform: "uppercase", letterSpacing: "1.5px" }}>Simulador Clinico Bolivia</div>
        </div>
        {[["inicio","Inicio"],["general","General"],["estudiante","Estudiante"],["admin","Docente"],["historial","Historial"]].map(([v, l]) => (
          <button key={v} onClick={() => setVista(v)} style={{ padding: "6px 12px", borderRadius: "16px", border: `1px solid ${vista === v ? "rgba(99,179,237,0.6)" : "rgba(255,255,255,0.08)"}`, background: vista === v ? "rgba(99,179,237,0.15)" : "transparent", color: vista === v ? "#63b3ed" : "#6a8faa", fontSize: "12px", fontWeight: vista === v ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
            {l}
          </button>
        ))}
      </nav>
      {vista === "inicio" && <Inicio setVista={setVista} />}
      {vista === "general" && <General />}
      {vista === "estudiante" && <Estudiante db={db} agregarHist={agregarHist} />}
      {vista === "admin" && (adminOk ? <Admin db={db} actualizarDB={actualizarDB} toast={mostrarToast} /> : <Pin onOk={() => setAdminOk(true)} />)}
      {vista === "historial" && <Historial historial={historial} />}
      {toast && <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "#1a3a5c", border: "1px solid rgba(99,179,237,0.4)", borderRadius: "12px", padding: "12px 20px", fontSize: "13px", color: "#63b3ed", zIndex: 999 }}>{toast}</div>}
    </div>
  );
}

function Inicio({ setVista }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 56px)", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ fontSize: "64px", marginBottom: "16px" }}>🏥</div>
      <h1 style={{ fontSize: "clamp(28px,6vw,56px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: "16px" }}>
        LoyolaSim<br /><span style={{ color: "#63b3ed" }}>Clinical</span>
      </h1>
      <p style={{ fontSize: "15px", color: "#6a8faa", maxWidth: "480px", marginBottom: "40px", lineHeight: 1.7 }}>
        Plataforma de simulacion clinica con inteligencia artificial para estudiantes de enfermeria.
      </p>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { v: "general", icon: "🩺", titulo: "Modo General", desc: "Describe sintomas y recibe orientacion basica en salud con respuesta por voz.", color: "#63b3ed" },
          { v: "estudiante", icon: "🎓", titulo: "Modo Estudiante", desc: "Practica casos clinicos con evaluacion inmediata por inteligencia artificial.", color: "#9f7aea" }
        ].map(({ v, icon, titulo, desc, color }) => (
          <div key={v} onClick={() => setVista(v)}
            style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: "20px", padding: "32px 24px", cursor: "pointer", flex: 1, minWidth: "240px", maxWidth: "280px", textAlign: "left", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = `${color}60`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = `${color}30`; }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>{icon}</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{titulo}</div>
            <div style={{ fontSize: "13px", color: "#6a8faa", lineHeight: 1.5, marginBottom: "16px" }}>{desc}</div>
            <div style={{ fontSize: "13px", color, fontWeight: 600 }}>Ingresar →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function useMic(onRes) {
  const ref = useRef(null);
  const [esc, setEsc] = useState(false);
  const toggle = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) { alert("El microfono requiere Google Chrome."); return; }
    if (esc) { ref.current?.stop(); setEsc(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = "es-ES"; r.continuous = false; r.interimResults = false;
    r.onresult = e => onRes(e.results[0][0].transcript);
    r.onend = () => setEsc(false);
    r.onerror = () => setEsc(false);
    ref.current = r; r.start(); setEsc(true);
  }, [esc, onRes]);
  return [esc, toggle];
}

function BtnMic({ esc, toggle, disabled }) {
  return (
    <button onClick={toggle} disabled={disabled}
      style={{ width: "48px", height: "48px", borderRadius: "50%", border: `2px solid ${esc ? "#ef4444" : "rgba(99,179,237,0.5)"}`, background: esc ? "rgba(239,68,68,0.15)" : "rgba(99,179,237,0.1)", color: esc ? "#ef4444" : "#63b3ed", fontSize: "20px", cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {esc ? "🔴" : "🎤"}
    </button>
  );
}

function General() {
  const [txt, setTxt] = useState("");
  const [carg, setCarg] = useState(false);
  const [res, setRes] = useState(null);
  const [ley, setLey] = useState(false);
  const onVoz = useCallback(t => setTxt(p => p ? p + " " + t : t), []);
  const [esc, toggle] = useMic(onVoz);

  const consultar = async () => {
    if (!txt.trim()) return;
    setCarg(true); setRes(null); detenerVoz();
    const r = await consultarSintomas(txt);
    setRes(r); setCarg(false);
    setLey(true);
    hablar(r.mensaje_voz, () => setLey(false));
  };

  const urg = res?.urgencia || "baja";
  const urgCol = { alta: "#ef4444", media: "#f59e0b", baja: "#10b981" };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 20px" }}>
      <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Orientacion en Salud</h2>
      <p style={{ color: "#6a8faa", fontSize: "13px", marginBottom: "24px" }}>Describe tus sintomas y la IA respondera en voz alta.</p>
      <div style={{ background: "rgba(99,179,237,0.05)", border: "1px solid rgba(99,179,237,0.2)", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
        <textarea value={txt} onChange={e => setTxt(e.target.value)} placeholder="Ejemplo: Tengo fiebre y dolor de cabeza desde ayer..."
          style={{ width: "100%", background: "transparent", border: "none", color: "#e8eaf0", fontFamily: "inherit", fontSize: "15px", resize: "none", outline: "none", minHeight: "90px", lineHeight: 1.6 }} />
        <div style={{ display: "flex", gap: "10px", marginTop: "12px", alignItems: "center" }}>
          <BtnMic esc={esc} toggle={toggle} />
          <button onClick={consultar} disabled={carg || !txt.trim()}
            style={{ flex: 1, padding: "12px 20px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "#fff", fontFamily: "inherit", fontSize: "14px", fontWeight: 600, cursor: "pointer", opacity: carg || !txt.trim() ? 0.5 : 1 }}>
            {carg ? "Consultando..." : "Consultar →"}
          </button>
        </div>
        {esc && <div style={{ marginTop: "8px", fontSize: "12px", color: "#ef4444", textAlign: "center" }}>Escuchando... habla ahora</div>}
      </div>
      {carg && <div style={{ textAlign: "center", padding: "24px", color: "#63b3ed" }}>Analizando sintomas...</div>}
      {res && (
        <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", padding: "24px" }}>
          <span style={{ background: `${urgCol[urg]}20`, color: urgCol[urg], border: `1px solid ${urgCol[urg]}40`, padding: "4px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
            {urg === "alta" ? "Urgencia Alta" : urg === "media" ? "Urgencia Media" : "Urgencia Baja"}
          </span>
          <div style={{ fontSize: "22px", color: "#34d399", fontWeight: 700, margin: "12px 0 6px" }}>{res.condicion}</div>
          <div style={{ fontSize: "14px", color: "#8ab0c8", marginBottom: "14px", lineHeight: 1.6 }}>{res.descripcion}</div>
          {res.recomendaciones?.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", padding: "8px 0", fontSize: "14px", color: "#b0c8dc", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "#34d399" }}>→</span>{r}
            </div>
          ))}
          <div style={{ marginTop: "14px", padding: "10px", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "12px", color: "#ca8a04", borderLeft: "3px solid #ca8a04" }}>
            Esta informacion es orientativa. Consulta siempre a un profesional de salud.
          </div>
          <button onClick={() => { detenerVoz(); setLey(true); hablar(res.mensaje_voz, () => setLey(false)); }} disabled={ley}
            style={{ marginTop: "14px", padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(99,179,237,0.3)", background: "transparent", color: "#63b3ed", fontFamily: "inherit", fontSize: "13px", cursor: "pointer", opacity: ley ? 0.5 : 1 }}>
            {ley ? "🔊 Leyendo..." : "🔊 Escuchar respuesta"}
          </button>
        </div>
      )}
    </div>
  );
}

function Estudiante({ db, agregarHist }) {
  const [paso, setPaso] = useState("area");
  const [areaId, setAreaId] = useState(null);
  const [casos, setCasos] = useState([]);
  const [casoIdx, setCasoIdx] = useState(0);
  const [respuesta, setRespuesta] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [carg, setCarg] = useState(false);
  const [ley, setLey] = useState(false);
  const [resultados, setResultados] = useState([]);

  const onVoz = useCallback(t => setRespuesta(p => p ? p + " " + t : t), []);
  const [esc, toggle] = useMic(onVoz);

  const area = db.areas.find(a => a.id === areaId);
  const caso = casos[casoIdx];
  const pregunta = caso?.preguntas[0];
  const totalCasos = casos.length;

  const iniciarArea = (aid) => {
    const a = db.areas.find(x => x.id === aid);
    setAreaId(aid);
    setCasos(a.casos);
    setCasoIdx(0);
    setRespuesta("");
    setFeedback(null);
    setResultados([]);
    setPaso("eval");
    const primer = a.casos[0];
    setTimeout(() => {
      setLey(true);
      hablar("Caso clinico numero 1. " + primer.caso + ". Pregunta: " + primer.preguntas[0].texto, () => setLey(false));
    }, 400);
  };

  const enviar = async () => {
    if (!respuesta.trim() || !pregunta) return;
    setCarg(true); setFeedback(null); detenerVoz();
    const r = await evaluarRespuesta(pregunta.texto, pregunta.respuesta, respuesta);
    const fb = { ...r, pts: r.correcto ? pregunta.puntaje : 0, max: pregunta.puntaje, caso: caso.titulo };
    setFeedback(fb); setCarg(false);
    setLey(true);
    hablar(r.mensaje_voz, () => setLey(false));
  };

  const siguiente = () => {
    const nuevos = [...resultados, feedback];
    setResultados(nuevos);
    if (casoIdx + 1 >= totalCasos) {
      const total = nuevos.reduce((s, r) => s + r.pts, 0);
      const max = nuevos.reduce((s, r) => s + r.max, 0);
      const pct = Math.round((total / max) * 100);
      agregarHist({ fecha: new Date().toISOString(), area: area.nombre, puntaje: total, maximo: max });
      setPaso("resumen");
      setTimeout(() => {
        setLey(true);
        const msg = pct >= 80
          ? `Evaluacion completada. Obtuviste ${total} de ${max} puntos. Excelente desempeno.`
          : `Evaluacion completada. Obtuviste ${total} de ${max} puntos. Repasa los temas donde tuviste dificultades.`;
        hablar(msg, () => setLey(false));
      }, 400);
    } else {
      const sig = casoIdx + 1;
      setCasoIdx(sig);
      setRespuesta("");
      setFeedback(null);
      setTimeout(() => {
        setLey(true);
        hablar("Caso clinico numero " + (sig + 1) + ". " + casos[sig].caso + ". Pregunta: " + casos[sig].preguntas[0].texto, () => setLey(false));
      }, 300);
    }
  };

  if (paso === "area") return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 20px" }}>
      <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Modo Estudiante</h2>
      <p style={{ color: "#6a8faa", fontSize: "13px", marginBottom: "24px" }}>Selecciona el area clinica. Evaluaras todos los casos del area uno por uno.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "14px" }}>
        {db.areas.map(a => (
          <div key={a.id} onClick={() => iniciarArea(a.id)}
            style={{ background: `${a.color}15`, border: `1px solid ${a.color}40`, borderRadius: "16px", padding: "24px 16px", cursor: "pointer", textAlign: "center", transition: "all 0.25s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>{a.icon}</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#c8d8e8", marginBottom: "4px" }}>{a.nombre}</div>
            <div style={{ fontSize: "11px", color: "#4a7fa5" }}>{a.casos.length} casos</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (paso === "eval" && caso) return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 20px" }}>
      {/* Progreso */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#4a7fa5", marginBottom: "6px" }}>
          <span>{area?.nombre}</span>
          <span>Caso {casoIdx + 1} de {totalCasos}</span>
        </div>
        <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg,#63b3ed,#9f7aea)", borderRadius: "4px", width: `${((casoIdx) / totalCasos) * 100}%`, transition: "width 0.4s" }} />
        </div>
      </div>

      {/* Caso */}
      <div style={{ background: "rgba(99,179,237,0.06)", border: "1px solid rgba(99,179,237,0.18)", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
        <div style={{ fontSize: "16px", color: "#63b3ed", fontWeight: 700, marginBottom: "8px" }}>📋 {caso.titulo}</div>
        <div style={{ fontSize: "14px", color: "#8ab0c8", lineHeight: 1.7 }}>{caso.caso}</div>
        <button onClick={() => { detenerVoz(); setLey(true); hablar(caso.caso + ". Pregunta: " + pregunta?.texto, () => setLey(false)); }} disabled={ley}
          style={{ marginTop: "10px", background: "transparent", border: "1px solid rgba(99,179,237,0.25)", color: "#63b3ed", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", opacity: ley ? 0.5 : 1 }}>
          {ley ? "🔊 Leyendo..." : "🔊 Escuchar caso"}
        </button>
      </div>

      {/* Pregunta y respuesta */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px" }}>
        <div style={{ fontSize: "11px", color: "#4a7fa5", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>Pregunta</div>
        <div style={{ fontSize: "17px", fontWeight: 600, color: "#e8eaf0", lineHeight: 1.6, marginBottom: "18px" }}>{pregunta?.texto}</div>

        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "12px" }}>
          <textarea value={respuesta} onChange={e => setRespuesta(e.target.value)} disabled={!!feedback}
            placeholder="Escribe tu respuesta o usa el microfono..."
            style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "14px", color: "#e8eaf0", fontFamily: "inherit", fontSize: "14px", resize: "none", outline: "none", minHeight: "80px", lineHeight: 1.6, opacity: feedback ? 0.7 : 1 }} />
          <BtnMic esc={esc} toggle={toggle} disabled={!!feedback} />
        </div>
        {esc && <div style={{ fontSize: "12px", color: "#ef4444", marginBottom: "8px", textAlign: "center" }}>🎤 Escuchando... habla ahora</div>}

        {!feedback && (
          <button onClick={enviar} disabled={carg || !respuesta.trim()}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#9f7aea,#7c3aed)", color: "#fff", fontFamily: "inherit", fontSize: "15px", fontWeight: 600, cursor: "pointer", opacity: carg || !respuesta.trim() ? 0.4 : 1 }}>
            {carg ? "Evaluando con IA..." : "Enviar respuesta →"}
          </button>
        )}

        {carg && <div style={{ textAlign: "center", padding: "14px", color: "#9f7aea" }}>Evaluando...</div>}

        {feedback && (
          <div style={{ background: feedback.correcto ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)", border: `1px solid ${feedback.correcto ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.3)"}`, borderRadius: "12px", padding: "20px", marginTop: "14px" }}>
            <div style={{ fontSize: "26px", fontWeight: 800, color: feedback.correcto ? "#34d399" : "#f87171", marginBottom: "6px" }}>
              {feedback.correcto ? "✓ CORRECTO" : "✗ INCORRECTO"}
            </div>
            <div style={{ fontSize: "13px", color: "#8ab0c8", marginBottom: "10px", fontStyle: "italic" }}>
              💡 {feedback.recomendacion}
            </div>
            {ley && <div style={{ fontSize: "12px", color: "#63b3ed", marginBottom: "10px" }}>🔊 Escucha el resultado...</div>}
            <button onClick={siguiente}
              style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: casoIdx + 1 >= totalCasos ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#63b3ed,#3b82f6)", color: "#fff", fontFamily: "inherit", fontSize: "14px", fontWeight: 700, cursor: "pointer", marginTop: "4px" }}>
              {casoIdx + 1 >= totalCasos ? "Ver resumen final →" : "Siguiente caso →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (paso === "resumen") {
    const total = resultados.reduce((s, r) => s + r.pts, 0);
    const max = resultados.reduce((s, r) => s + r.max, 0);
    const pct = max > 0 ? Math.round((total / max) * 100) : 0;
    const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
    const correctos = resultados.filter(r => r.correcto).length;
    const incorrectos = resultados.filter(r => !r.correcto).length;

    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏁</div>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Evaluacion Completada</h2>
        <p style={{ color: "#4a7fa5", fontSize: "13px", marginBottom: "28px" }}>{area?.nombre}</p>

        {/* Circulo de puntaje */}
        <div style={{ width: "140px", height: "140px", borderRadius: "50%", margin: "0 auto 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `conic-gradient(${color} ${pct * 3.6}deg, rgba(255,255,255,0.06) 0)`, boxShadow: `0 0 40px ${color}30` }}>
          <div style={{ width: "112px", height: "112px", borderRadius: "50%", background: "#0d1a2e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: "11px", color: "#4a7fa5" }}>{total}/{max} pts</div>
          </div>
        </div>

        {/* Estadisticas */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "24px" }}>
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "14px 24px" }}>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#34d399" }}>{correctos}</div>
            <div style={{ fontSize: "12px", color: "#4a7fa5" }}>Correctos</div>
          </div>
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "14px 24px" }}>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#f87171" }}>{incorrectos}</div>
            <div style={{ fontSize: "12px", color: "#4a7fa5" }}>Incorrectos</div>
          </div>
        </div>

        {/* Detalle por caso */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", marginBottom: "20px", textAlign: "left" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#4a7fa5", marginBottom: "14px" }}>Detalle por caso</div>
          {resultados.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: i < resultados.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: "#c8d8e8", marginBottom: "2px" }}>{r.caso}</div>
                <div style={{ fontSize: "11px", color: "#4a7fa5", fontStyle: "italic" }}>{r.recomendacion}</div>
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: r.correcto ? "#34d399" : "#f87171", flexShrink: 0 }}>
                {r.correcto ? "✓" : "✗"}
              </div>
            </div>
          ))}
        </div>

        {/* Recomendacion general */}
        <div style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)", borderRadius: "12px", padding: "16px", marginBottom: "20px", textAlign: "left" }}>
          <div style={{ fontSize: "13px", color: "#63b3ed", fontWeight: 600, marginBottom: "6px" }}>📚 Recomendacion general</div>
          <div style={{ fontSize: "13px", color: "#8ab0c8", lineHeight: 1.5 }}>
            {pct >= 80 ? "Excelente manejo de los casos clinicos. Sigue practicando para mantener tu nivel." : pct >= 60 ? "Buen desempeno. Repasa los casos que fallaste antes de la evaluacion final." : "Necesitas reforzar los temas. Revisa el material de clase y practica mas casos."}
          </div>
        </div>

        <button onClick={() => { setPaso("area"); setResultados([]); }}
          style={{ width: "100%", padding: "14px", borderRadius: "30px", border: "none", background: "linear-gradient(135deg,#63b3ed,#3b82f6)", color: "#fff", fontFamily: "inherit", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
          Evaluar otra area →
        </button>
      </div>
    );
  }

  return null;
}

function Pin({ onOk }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const check = () => { if (pin === ADMIN_PIN) onOk(); else { setErr(true); setPin(""); } };
  return (
    <div style={{ maxWidth: "320px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔐</div>
      <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Panel Docente</div>
      <div style={{ fontSize: "13px", color: "#6a8faa", marginBottom: "28px" }}>Ingresa tu PIN para administrar los casos</div>
      <input type="password" value={pin} onChange={e => { setPin(e.target.value); setErr(false); }} onKeyDown={e => e.key === "Enter" && check()} maxLength={6} placeholder="••••"
        style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${err ? "#ef4444" : "rgba(255,255,255,0.15)"}`, borderRadius: "12px", padding: "16px", color: "#e8eaf0", fontSize: "24px", textAlign: "center", letterSpacing: "8px", outline: "none", fontFamily: "inherit", marginBottom: "10px" }} />
      {err && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "10px" }}>PIN incorrecto.</div>}
      <button onClick={check} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Acceder →</button>
      <div style={{ marginTop: "12px", fontSize: "11px", color: "#3a5a7a" }}>PIN por defecto: 1234</div>
    </div>
  );
}

function Admin({ db, actualizarDB, toast }) {
  const [tab, setTab] = useState(db.areas[0]?.id || "");
  const [abierto, setAbierto] = useState(null);
  const area = db.areas.find(a => a.id === tab);

  const updCaso = (cid, f, v) => actualizarDB({ ...db, areas: db.areas.map(a => a.id !== tab ? a : { ...a, casos: a.casos.map(c => c.id !== cid ? c : { ...c, [f]: v }) }) });
  const updQ = (cid, f, v) => actualizarDB({ ...db, areas: db.areas.map(a => a.id !== tab ? a : { ...a, casos: a.casos.map(c => { if (c.id !== cid) return c; const q = { ...c.preguntas[0], [f]: f === "puntaje" ? parseInt(v) || 0 : v }; return { ...c, preguntas: [q] }; }) }) });
  const addCaso = () => { const id = "c" + Date.now(); actualizarDB({ ...db, areas: db.areas.map(a => a.id !== tab ? a : { ...a, casos: [...a.casos, { id, titulo: "Nuevo caso", caso: "", preguntas: [{ texto: "", respuesta: "", puntaje: 10 }] }] }) }); setAbierto(id); toast("Caso agregado"); };
  const delCaso = cid => { if (!confirm("Eliminar este caso?")) return; actualizarDB({ ...db, areas: db.areas.map(a => a.id !== tab ? a : { ...a, casos: a.casos.filter(c => c.id !== cid) }) }); toast("Eliminado"); };
  const reset = () => { if (!confirm("Restaurar base de datos original?")) return; actualizarDB(INITIAL_DB); toast("Restaurado"); };

  const inp = { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "10px 14px", color: "#e8eaf0", fontFamily: "inherit", fontSize: "14px", outline: "none", marginBottom: "10px" };

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "10px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff" }}>Panel Docente</h2>
        <button onClick={reset} style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "#f87171", fontFamily: "inherit", fontSize: "12px", cursor: "pointer" }}>Restaurar original</button>
      </div>
      <p style={{ color: "#6a8faa", fontSize: "13px", marginBottom: "20px" }}>Cada caso tiene 1 pregunta y 1 respuesta esperada. Los cambios se guardan automaticamente.</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {db.areas.map(a => (
          <button key={a.id} onClick={() => setTab(a.id)} style={{ padding: "7px 14px", borderRadius: "20px", border: `1px solid ${tab === a.id ? a.color + "80" : "rgba(255,255,255,0.1)"}`, background: tab === a.id ? a.color + "20" : "transparent", color: tab === a.id ? "#e8eaf0" : "#6a8faa", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", fontWeight: tab === a.id ? 600 : 400 }}>
            {a.icon} {a.nombre}
          </button>
        ))}
      </div>
      {area && (
        <>
          <button onClick={addCaso} style={{ marginBottom: "16px", padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(99,179,237,0.35)", background: "transparent", color: "#63b3ed", fontFamily: "inherit", fontSize: "13px", cursor: "pointer" }}>+ Agregar caso</button>
          {area.casos.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "#4a7fa5" }}>No hay casos. Agrega el primero.</div>}
          {area.casos.map(c => (
            <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 18px", marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: abierto === c.id ? "14px" : "0", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#c8d8e8" }}>📋 {c.titulo || "Sin titulo"}</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setAbierto(abierto === c.id ? null : c.id)} style={{ padding: "5px 12px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#6a8faa", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>{abierto === c.id ? "Contraer" : "Editar"}</button>
                  <button onClick={() => delCaso(c.id)} style={{ padding: "5px 12px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "#f87171", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>Eliminar</button>
                </div>
              </div>
              {abierto === c.id && (
                <>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#4a7fa5", display: "block", marginBottom: "5px" }}>Titulo</label>
                  <input style={inp} value={c.titulo} onChange={e => updCaso(c.id, "titulo", e.target.value)} placeholder="Titulo del caso..." />
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#4a7fa5", display: "block", marginBottom: "5px" }}>Descripcion del caso</label>
                  <textarea style={{ ...inp, resize: "vertical", minHeight: "70px", lineHeight: 1.5 }} value={c.caso} onChange={e => updCaso(c.id, "caso", e.target.value)} placeholder="Describe el caso clinico brevemente..." />
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#4a7fa5", display: "block", marginBottom: "5px" }}>Pregunta</label>
                  <input style={inp} value={c.preguntas[0]?.texto || ""} onChange={e => updQ(c.id, "texto", e.target.value)} placeholder="Pregunta de evaluacion..." />
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#4a7fa5", display: "block", marginBottom: "5px" }}>Respuesta esperada</label>
                  <textarea style={{ ...inp, resize: "vertical", minHeight: "60px", lineHeight: 1.5 }} value={c.preguntas[0]?.respuesta || ""} onChange={e => updQ(c.id, "respuesta", e.target.value)} placeholder="Respuesta que la IA usara para evaluar..." />
                  <label style={{ fontSize: "12px", color: "#6a8faa", display: "flex", alignItems: "center", gap: "8px" }}>
                    Puntaje: <input type="number" min="1" max="20" value={c.preguntas[0]?.puntaje || 10} onChange={e => updQ(c.id, "puntaje", e.target.value)} style={{ ...inp, width: "70px", marginBottom: 0, textAlign: "center", padding: "6px" }} />
                  </label>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function Historial({ historial }) {
  if (historial.length === 0) return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "32px 20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "28px" }}>Historial</h2>
      <div style={{ textAlign: "center", padding: "60px", color: "#4a7fa5" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
        No hay evaluaciones registradas aun.
      </div>
    </div>
  );
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "32px 20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Historial</h2>
      <p style={{ color: "#6a8faa", fontSize: "13px", marginBottom: "20px" }}>{historial.length} evaluacion(es)</p>
      {historial.map((h, i) => {
        const pct = Math.round((h.puntaje / h.maximo) * 100);
        const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
        return (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 20px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: "#c8d8e8", marginBottom: "4px", fontSize: "14px" }}>{h.area}</div>
              <div style={{ fontSize: "12px", color: "#4a7fa5" }}>{new Date(h.fecha).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" })}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: "20px", fontWeight: 700, color }}>{pct}%</div>
              <div style={{ fontSize: "11px", color: "#4a7fa5" }}>{h.puntaje}/{h.maximo} pts</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
