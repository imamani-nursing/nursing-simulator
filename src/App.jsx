import React, { useState, useEffect, useRef, useCallback } from "react";

const INITIAL_DB = {
  areas: [
    {
      id: "gineco", nombre: "Ginecoobstetricia", icon: "🤱", color: "#6C3483",
      casos: [
        { id: "g1", titulo: "Trabajo de Parto", caso: "Mujer de 24 anos con 38 semanas de embarazo llega al centro de salud con dolor abdominal cada 5 minutos y salida de liquido transparente.", preguntas: [{ texto: "Que signo indica que la paciente esta iniciando trabajo de parto?", respuesta: "Las contracciones frecuentes y la salida de liquido amniotico indican inicio del trabajo de parto.", puntaje: 10, palabrasClave: ["contracciones","liquido amniotico","trabajo de parto","dolor abdominal","frecuentes"] }] },
        { id: "g2", titulo: "Preeclampsia", caso: "Gestante de 30 semanas presenta dolor de cabeza intenso, vision borrosa y presion arterial de 150 sobre 100 milimetros de mercurio.", preguntas: [{ texto: "Que complicacion del embarazo podria presentar la paciente?", respuesta: "La paciente podria presentar preeclampsia.", puntaje: 10, palabrasClave: ["preeclampsia","presion","hipertension","eclampsia"] }] }
      ]
    },
    {
      id: "materno", nombre: "Materno Infantil", icon: "👩‍👦", color: "#B7950B",
      casos: [
        { id: "m1", titulo: "Lactancia Materna", caso: "Una madre lleva a su bebe de 4 meses al control. Refiere que solo recibe leche materna.", preguntas: [{ texto: "Que recomendacion se debe brindar a la madre?", respuesta: "Continuar con lactancia materna exclusiva hasta los 6 meses.", puntaje: 10, palabrasClave: ["lactancia","materna","exclusiva","6 meses","seis meses","continuar"] }] },
        { id: "m2", titulo: "Hipotermia Neonatal", caso: "Un recien nacido presenta temperatura baja, piel fria y llanto debil.", preguntas: [{ texto: "Que accion inmediata debe realizar enfermeria?", respuesta: "Abrigar al recien nacido y mantener calor corporal mediante contacto piel a piel.", puntaje: 10, palabrasClave: ["abrigar","calor","piel a piel","temperatura","abrigo","calentar"] }] }
      ]
    },
    {
      id: "pediatria", nombre: "Pediatria", icon: "👶", color: "#1A5276",
      casos: [
        { id: "p1", titulo: "Dificultad Respiratoria", caso: "Nino de 5 anos llega con fiebre, tos y dificultad respiratoria leve.", preguntas: [{ texto: "Que signo vital debe vigilarse prioritariamente?", respuesta: "La frecuencia respiratoria y la saturacion de oxigeno.", puntaje: 10, palabrasClave: ["frecuencia respiratoria","saturacion","oxigeno","respiracion","signos vitales"] }] },
        { id: "p2", titulo: "Deshidratacion", caso: "Nina de 2 anos presenta diarrea y vomitos desde hace dos dias. Tiene labios secos y llora sin lagrimas.", preguntas: [{ texto: "Que problema presenta la paciente?", respuesta: "Presenta signos de deshidratacion.", puntaje: 10, palabrasClave: ["deshidratacion","deshidratada","liquidos","agua","hidratacion"] }] }
      ]
    },
    {
      id: "quirurgica", nombre: "Instrumentacion Quirurgica", icon: "🏥", color: "#1E8449",
      casos: [
        { id: "q1", titulo: "Conteo de Gasas", caso: "Durante una cirugia el instrumentador nota que falta una gasa del conteo inicial.", preguntas: [{ texto: "Que debe hacer inmediatamente?", respuesta: "Informar al equipo quirurgico y realizar un nuevo conteo antes de cerrar la cirugia.", puntaje: 10, palabrasClave: ["informar","conteo","equipo","quirurgico","nuevo conteo","cerrar"] }] },
        { id: "q2", titulo: "Esterilizacion", caso: "Antes de iniciar una cirugia el personal verifica la esterilidad del instrumental.", preguntas: [{ texto: "Por que es importante la esterilizacion?", respuesta: "Porque previene infecciones y contaminacion del paciente.", puntaje: 10, palabrasClave: ["infecciones","contamina","esteril","bacterias","microorganismos","previene"] }] }
      ]
    },
    {
      id: "primeros", nombre: "Primeros Auxilios", icon: "🚑", color: "#922B21",
      casos: [
        { id: "a1", titulo: "Hemorragia", caso: "Un joven cae de una motocicleta y presenta sangrado abundante en el brazo.", preguntas: [{ texto: "Que accion de primeros auxilios debe realizarse primero?", respuesta: "Aplicar presion directa sobre la herida para controlar el sangrado.", puntaje: 10, palabrasClave: ["presion","directa","herida","sangrado","comprimir","compresion"] }] },
        { id: "a2", titulo: "Paciente Inconsciente", caso: "Una persona pierde el conocimiento en la calle pero respira normalmente.", preguntas: [{ texto: "En que posicion debe colocarse al paciente?", respuesta: "Debe colocarse en posicion lateral de seguridad.", puntaje: 10, palabrasClave: ["lateral","seguridad","posicion lateral","costado","decubito"] }] }
      ]
    }
  ]
};

const ADMIN_PIN = "1234";
const LOGO_URL = const LOGO_URL = "https://raw.githubusercontent.com/imamani-nursing/nursing-simulator/main/public/fa88d381-f0a6-4bcb-a1e3-53bfd8e930e7.jpg";

// ── SONIDO ROBÓTICO ─────────────────────────────────────────────
function tocarSonidoRobotico() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const servo = (f1, f2, t, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const distortion = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i * 2) / 256 - 1;
        curve[i] = (Math.PI + 300) * x / (Math.PI + 300 * Math.abs(x));
      }
      distortion.curve = curve;
      osc.connect(distortion);
      distortion.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f1, ctx.currentTime + t);
      osc.frequency.linearRampToValueAtTime(f2, ctx.currentTime + t + dur);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + dur);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + dur + 0.05);
    };

    const golpe = (freq, t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + t);
      osc.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + t + 0.35);
      gain.gain.setValueAtTime(0.6, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.35);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.4);
    };

    const metalico = (freq, t, dur, vol = 0.2) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square"; osc2.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + t);
      osc2.frequency.setValueAtTime(freq * 1.5, ctx.currentTime + t);
      osc.frequency.linearRampToValueAtTime(freq * 0.6, ctx.currentTime + t + dur);
      osc2.frequency.linearRampToValueAtTime(freq * 0.9, ctx.currentTime + t + dur);
      gain.gain.setValueAtTime(vol, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + dur);
      osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + dur + 0.05);
      osc2.start(ctx.currentTime + t); osc2.stop(ctx.currentTime + t + dur + 0.05);
    };

    const beep = (freq, t, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + t);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + t);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + t + dur - 0.01);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + t + dur);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + dur + 0.05);
    };

    // SECUENCIA ROBÓTICA tipo sistema activándose
    golpe(90, 0.0);              // BOOM grave inicial
    servo(30, 900, 0.05, 0.5);  // Servo arrancando
    metalico(180, 0.4, 0.25);   // Crujido mecánico
    servo(900, 150, 0.55, 0.4); // Servo estabilizando
    golpe(60, 0.8);              // Segundo impacto
    metalico(250, 0.9, 0.2);
    metalico(400, 1.05, 0.15);
    servo(200, 1500, 1.1, 0.5); // Carga de energía
    beep(440, 1.55, 0.08);      // Beeps digitales
    beep(440, 1.65, 0.08);
    beep(880, 1.75, 0.15);      // Beep confirmación
    metalico(600, 1.85, 0.3, 0.15); // Resonancia final
    golpe(50, 2.0);              // Golpe de activación final

  } catch (e) {}
}

// ── EVALUACIÓN LOCAL ────────────────────────────────────────────
function evaluarLocal(respuestaEstudiante, palabrasClave) {
  const texto = respuestaEstudiante.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const claves = palabrasClave.map(p => p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  const coincidencias = claves.filter(c => texto.includes(c));
  const porcentaje = claves.length > 0 ? coincidencias.length / claves.length : 0;
  const correcto = porcentaje >= 0.4;
  return correcto
    ? { correcto: true, mensaje_voz: "Correcto, muy bien. Tu respuesta menciona los conceptos clave.", recomendacion: "Excelente. Sigue repasando para reforzar el tema." }
    : { correcto: false, mensaje_voz: "Respuesta incompleta. Revisa los conceptos clave del tema.", recomendacion: `Recuerda mencionar: ${palabrasClave.slice(0, 3).join(", ")}.` };
}

function consultarSintomasLocal(sintomas) {
  const txt = sintomas.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (txt.includes("fiebre") || txt.includes("temperatura"))
    return { condicion: "Posible fiebre o infeccion", descripcion: "La fiebre puede ser signo de infeccion u otras condiciones.", recomendaciones: ["Tomar temperatura cada 4 horas", "Hidratarse bien con agua o suero", "Consultar medico si supera 38.5 grados"], urgencia: "media", mensaje_voz: "Presenta fiebre que puede indicar una infeccion. Es importante hidratarse y consultar a un medico si la temperatura es alta." };
  if (txt.includes("dolor de cabeza") || txt.includes("cefalea"))
    return { condicion: "Cefalea", descripcion: "Dolor de cabeza que puede tener multiples causas.", recomendaciones: ["Descansar en lugar tranquilo", "Hidratarse bien", "Evitar pantallas y luz intensa"], urgencia: "baja", mensaje_voz: "Presenta dolor de cabeza. Descanse, hidratese y consulte a un medico si el dolor es muy intenso o no mejora." };
  if (txt.includes("diarrea") || txt.includes("vomito") || txt.includes("nausea"))
    return { condicion: "Trastorno gastrointestinal", descripcion: "Sintomas digestivos que pueden causar deshidratacion.", recomendaciones: ["Tomar suero oral o agua con sal y azucar", "Dieta blanda: arroz, platano, manzana", "Consultar medico si hay sangre o dura mas de 48h"], urgencia: "media", mensaje_voz: "Presenta sintomas gastrointestinales. Es muy importante hidratarse para evitar deshidratacion y consultar a un medico." };
  if (txt.includes("pecho") || txt.includes("corazon") || txt.includes("respirar") || txt.includes("dificultad"))
    return { condicion: "Sintomas cardiorespiratorios", descripcion: "Sintomas que requieren evaluacion medica urgente.", recomendaciones: ["Buscar atencion medica inmediata", "No hacer esfuerzo fisico", "Llamar a emergencias si empeora"], urgencia: "alta", mensaje_voz: "Los sintomas que describe pueden ser graves. Busque atencion medica de inmediato o llame a emergencias." };
  return { condicion: "Consulta general", descripcion: "Los sintomas descritos requieren evaluacion profesional.", recomendaciones: ["Consultar a un medico", "No automedicarse", "Registrar cuando iniciaron los sintomas"], urgencia: "baja", mensaje_voz: "Para los sintomas que describe es importante consultar a un profesional de salud para un diagnostico adecuado." };
}

let vocesListas = false;
let mejorVozES = null;
function inicializarVoces() {
  if (vocesListas) return;
  const actualizar = () => {
    const voces = window.speechSynthesis.getVoices();
    const prioridad = ["Microsoft Sabina", "Microsoft Laura", "Microsoft Helena", "Google espanol", "Google Spanish", "Paulina", "Monica", "Jorge"];
    for (const nombre of prioridad) { const voz = voces.find(v => v.name.includes(nombre)); if (voz) { mejorVozES = voz; break; } }
    if (!mejorVozES) mejorVozES = voces.find(v => v.lang.startsWith("es")) || null;
    vocesListas = true;
  };
  if (window.speechSynthesis && window.speechSynthesis.getVoices().length > 0) actualizar();
  else if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = actualizar;
}
function hablar(texto, alTerminar) {
  if (!window.speechSynthesis) { if (alTerminar) alTerminar(); return; }
  window.speechSynthesis.cancel();
  inicializarVoces();
  const ejecutar = () => {
    const utt = new SpeechSynthesisUtterance(texto);
    utt.lang = "es-ES"; utt.rate = 0.85; utt.pitch = 1.05; utt.volume = 1;
    if (mejorVozES) utt.voice = mejorVozES;
    if (alTerminar) utt.onend = alTerminar;
    utt.onerror = () => { if (alTerminar) alTerminar(); };
    window.speechSynthesis.speak(utt);
  };
  if (vocesListas) ejecutar(); else setTimeout(ejecutar, 300);
}
function detenerVoz() { if (window.speechSynthesis) window.speechSynthesis.cancel(); }

const guardar = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} };
const cargar = async (k, def) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : def; } catch { return def; } };

// ── SPLASH ──────────────────────────────────────────────────────
function SplashScreen({ onEntrar }) {
  const [pulse, setPulse] = useState(false);
  const [activando, setActivando] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1200);
    return () => clearInterval(interval);
  }, []);

  const handleEntrar = () => {
    if (activando) return;
    setActivando(true);
    tocarSonidoRobotico();
    setTimeout(() => onEntrar(), 2200);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0a0f1e 0%,#0d1a2e 50%,#0a1628 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif", padding: "40px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ position: "absolute", borderRadius: "50%", background: `rgba(99,179,237,${0.03 + i * 0.01})`, width: `${200 + i * 120}px`, height: `${200 + i * 120}px`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: `ripple ${3 + i}s ease-in-out infinite` }} />
        ))}
      </div>

      <style>{`
        @keyframes ripple { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.4} 50%{transform:translate(-50%,-50%) scale(1.05);opacity:0.8} }
        @keyframes fadeInDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 30px rgba(99,179,237,0.3),0 0 60px rgba(99,179,237,0.1)} 50%{box-shadow:0 0 50px rgba(99,179,237,0.6),0 0 100px rgba(99,179,237,0.2)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes shake { 0%,100%{transform:scale(1.08)} 25%{transform:scale(1.05) rotate(-1deg)} 75%{transform:scale(1.05) rotate(1deg)} }
      `}</style>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,transparent,rgba(99,179,237,0.6),transparent)", animation: "scanline 3s linear infinite", pointerEvents: "none" }} />

      <div style={{ animation: "fadeInDown 0.8s ease forwards", marginBottom: "8px", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "clamp(28px,7vw,52px)", fontWeight: 900, color: activando ? "#34d399" : "#fff", letterSpacing: "-1px", lineHeight: 1.1, transition: "color 0.3s" }}>
          LoyolaSim
        </div>
        <div style={{ fontSize: "clamp(16px,4vw,28px)", fontWeight: 400, color: activando ? "#34d399" : "#63b3ed", letterSpacing: "4px", textTransform: "uppercase", transition: "color 0.3s" }}>
          {activando ? "INICIANDO..." : "Clinical"}
        </div>
      </div>

      <div style={{ width: "80px", height: "2px", background: "linear-gradient(90deg,transparent,#63b3ed,transparent)", margin: "16px auto", position: "relative", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 1, margin: "24px 0" }}>
        <div style={{ fontSize: "11px", color: "#4a7fa5", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
          {activando ? "⚡ Sistema activándose..." : "Presiona el logo para ingresar"}
        </div>
        <button onClick={handleEntrar} disabled={activando}
          style={{ background: "transparent", border: "none", cursor: activando ? "default" : "pointer", padding: 0, borderRadius: "50%", animation: activando ? "shake 0.1s infinite" : "glow 2s ease-in-out infinite", transition: "transform 0.2s" }}
          onMouseEnter={e => { if (!activando) e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={e => { if (!activando) e.currentTarget.style.transform = "scale(1)"; }}>
          <img src={LOGO_URL} alt="Universidad Loyola"
            style={{ width: "180px", height: "180px", objectFit: "contain", borderRadius: "50%", background: activando ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.95)", padding: "12px", display: "block", transition: "background 0.3s", filter: activando ? "brightness(1.2)" : "none" }} />
        </button>
        <div style={{ marginTop: "16px", fontSize: "13px", color: activando ? "#34d399" : pulse ? "#63b3ed" : "#2a5a7a", transition: "color 0.3s", fontWeight: 600 }}>
          {activando ? "⚙ Cargando sistema..." : "● Toca para comenzar"}
        </div>
      </div>

      <div style={{ animation: "fadeInUp 1.2s ease forwards", position: "relative", zIndex: 1, marginTop: "8px" }}>
        <div style={{ fontSize: "13px", color: "#4a7fa5", textTransform: "uppercase", letterSpacing: "3px" }}>Carrera de Enfermería</div>
        <div style={{ fontSize: "11px", color: "#2a4a6a", marginTop: "4px" }}>Universidad Loyola · Bolivia</div>
      </div>
    </div>
  );
}

// ── APP PRINCIPAL ───────────────────────────────────────────────
export default function App() {
  const [splash, setSplash] = useState(true);
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
  const agregarHist = async e => { const nuevo = [e, ...historial].slice(0, 30); setHistorial(nuevo); await guardar("loyolasim_v5_hist", nuevo); };
  const mostrarToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  if (splash) return <SplashScreen onEntrar={() => setSplash(false)} />;
  if (!db) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0f1e", color: "#63b3ed", fontFamily: "system-ui,sans-serif", fontSize: "18px" }}>Cargando...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e,#0d1a2e)", fontFamily: "system-ui,sans-serif", color: "#e8eaf0" }}>
      <nav style={{ background: "rgba(10,15,30,0.95)", borderBottom: "1px solid rgba(99,179,237,0.15)", padding: "0 16px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px", minHeight: "56px", position: "sticky", top: 0, zIndex: 100 }}>
        <img src={LOGO_URL} alt="Loyola" onClick={() => setSplash(true)} style={{ width: "34px", height: "34px", objectFit: "contain", borderRadius: "50%", background: "#fff", padding: "3px", cursor: "pointer", marginRight: "6px" }} />
        <div style={{ marginRight: "auto", padding: "8px 0" }}>
          <div style={{ fontSize: "16px", fontWeight: 800, color: "#63b3ed" }}>LoyolaSim Clinical</div>
          <div style={{ fontSize: "9px", color: "#3a6a8a", textTransform: "uppercase", letterSpacing: "1.5px" }}>Carrera de Enfermeria</div>
        </div>
        {[["inicio","Inicio"],["general","General"],["estudiante","Estudiante"],["admin","Docente"],["historial","Historial"]].map(([v, l]) => (
          <button key={v} onClick={() => setVista(v)} style={{ padding: "6px 12px", borderRadius: "16px", border: `1px solid ${vista === v ? "rgba(99,179,237,0.6)" : "rgba(255,255,255,0.08)"}`, background: vista === v ? "rgba(99,179,237,0.15)" : "transparent", color: vista === v ? "#63b3ed" : "#6a8faa", fontSize: "12px", fontWeight: vista === v ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>{l}</button>
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
      <h1 style={{ fontSize: "clamp(28px,6vw,56px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: "16px" }}>LoyolaSim<br /><span style={{ color: "#63b3ed" }}>Clinical</span></h1>
      <p style={{ fontSize: "15px", color: "#6a8faa", maxWidth: "480px", marginBottom: "40px", lineHeight: 1.7 }}>Plataforma de simulacion clinica para estudiantes de enfermeria.</p>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        {[{ v: "general", icon: "🩺", titulo: "Modo General", desc: "Describe sintomas y recibe orientacion basica en salud con respuesta por voz.", color: "#63b3ed" }, { v: "estudiante", icon: "🎓", titulo: "Modo Estudiante", desc: "Practica casos clinicos con evaluacion inmediata.", color: "#9f7aea" }].map(({ v, icon, titulo, desc, color }) => (
          <div key={v} onClick={() => setVista(v)} style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: "20px", padding: "32px 24px", cursor: "pointer", flex: 1, minWidth: "240px", maxWidth: "280px", textAlign: "left", transition: "all 0.3s" }}
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
    r.onend = () => setEsc(false); r.onerror = () => setEsc(false);
    ref.current = r; r.start(); setEsc(true);
  }, [esc, onRes]);
  return [esc, toggle];
}

function BtnMic({ esc, toggle, disabled }) {
  return (
    <button onClick={toggle} disabled={disabled} style={{ width: "48px", height: "48px", borderRadius: "50%", border: `2px solid ${esc ? "#ef4444" : "rgba(99,179,237,0.5)"}`, background: esc ? "rgba(239,68,68,0.15)" : "rgba(99,179,237,0.1)", color: esc ? "#ef4444" : "#63b3ed", fontSize: "20px", cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {esc ? "🔴" : "🎤"}
    </button>
  );
}

function General() {
  const [txt, setTxt] = useState(""); const [res, setRes] = useState(null); const [ley, setLey] = useState(false);
  const onVoz = useCallback(t => setTxt(p => p ? p + " " + t : t), []);
  const [esc, toggle] = useMic(onVoz);
  const consultar = () => { if (!txt.trim()) return; detenerVoz(); const r = consultarSintomasLocal(txt); setRes(r); setLey(true); hablar(r.mensaje_voz, () => setLey(false)); };
  const urg = res?.urgencia || "baja";
  const urgCol = { alta: "#ef4444", media: "#f59e0b", baja: "#10b981" };
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 20px" }}>
      <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Orientacion en Salud</h2>
      <p style={{ color: "#6a8faa", fontSize: "13px", marginBottom: "24px" }}>Describe tus sintomas y recibiras orientacion con respuesta por voz.</p>
      <div style={{ background: "rgba(99,179,237,0.05)", border: "1px solid rgba(99,179,237,0.2)", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
        <textarea value={txt} onChange={e => setTxt(e.target.value)} placeholder="Ejemplo: Tengo fiebre y dolor de cabeza desde ayer..." style={{ width: "100%", background: "transparent", border: "none", color: "#e8eaf0", fontFamily: "inherit", fontSize: "15px", resize: "none", outline: "none", minHeight: "90px", lineHeight: 1.6 }} />
        <div style={{ display: "flex", gap: "10px", marginTop: "12px", alignItems: "center" }}>
          <BtnMic esc={esc} toggle={toggle} />
          <button onClick={consultar} disabled={!txt.trim()} style={{ flex: 1, padding: "12px 20px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "#fff", fontFamily: "inherit", fontSize: "14px", fontWeight: 600, cursor: "pointer", opacity: !txt.trim() ? 0.5 : 1 }}>Consultar →</button>
        </div>
        {esc && <div style={{ marginTop: "8px", fontSize: "12px", color: "#ef4444", textAlign: "center" }}>Escuchando... habla ahora</div>}
      </div>
      {res && (
        <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", padding: "24px" }}>
          <span style={{ background: `${urgCol[urg]}20`, color: urgCol[urg], border: `1px solid ${urgCol[urg]}40`, padding: "4px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>{urg === "alta" ? "Urgencia Alta" : urg === "media" ? "Urgencia Media" : "Urgencia Baja"}</span>
          <div style={{ fontSize: "22px", color: "#34d399", fontWeight: 700, margin: "12px 0 6px" }}>{res.condicion}</div>
          <div style={{ fontSize: "14px", color: "#8ab0c8", marginBottom: "14px", lineHeight: 1.6 }}>{res.descripcion}</div>
          {res.recomendaciones?.map((r, i) => <div key={i} style={{ display: "flex", gap: "10px", padding: "8px 0", fontSize: "14px", color: "#b0c8dc", borderBottom: "1px solid rgba(255,255,255,0.05)" }}><span style={{ color: "#34d399" }}>→</span>{r}</div>)}
          <div style={{ marginTop: "14px", padding: "10px", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "12px", color: "#ca8a04", borderLeft: "3px solid #ca8a04" }}>Esta informacion es orientativa. Consulta siempre a un profesional de salud.</div>
          <button onClick={() => { detenerVoz(); setLey(true); hablar(res.mensaje_voz, () => setLey(false)); }} disabled={ley} style={{ marginTop: "14px", padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(99,179,237,0.3)", background: "transparent", color: "#63b3ed", fontFamily: "inherit", fontSize: "13px", cursor: "pointer", opacity: ley ? 0.5 : 1 }}>{ley ? "🔊 Leyendo..." : "🔊 Escuchar respuesta"}</button>
        </div>
      )}
    </div>
  );
}

function Estudiante({ db, agregarHist }) {
  const [paso, setPaso] = useState("area"); const [areaId, setAreaId] = useState(null); const [casos, setCasos] = useState([]);
  const [casoIdx, setCasoIdx] = useState(0); const [respuesta, setRespuesta] = useState(""); const [feedback, setFeedback] = useState(null);
  const [ley, setLey] = useState(false); const [resultados, setResultados] = useState([]);
  const onVoz = useCallback(t => setRespuesta(p => p ? p + " " + t : t), []);
  const [esc, toggle] = useMic(onVoz);
  const area = db.areas.find(a => a.id === areaId);
  const caso = casos[casoIdx]; const pregunta = caso?.preguntas[0]; const totalCasos = casos.length;

  const iniciarArea = (aid) => {
    const a = db.areas.find(x => x.id === aid);
    setAreaId(aid); setCasos(a.casos); setCasoIdx(0); setRespuesta(""); setFeedback(null); setResultados([]); setPaso("eval");
    setTimeout(() => { setLey(true); hablar("Caso clinico numero 1. " + a.casos[0].caso + ". Pregunta: " + a.casos[0].preguntas[0].texto, () => setLey(false)); }, 400);
  };

  const enviar = () => {
    if (!respuesta.trim() || !pregunta) return;
    detenerVoz();
    const r = evaluarLocal(respuesta, pregunta.palabrasClave || []);
    const fb = { ...r, pts: r.correcto ? pregunta.puntaje : 0, max: pregunta.puntaje, caso: caso.titulo, respuestaEsperada: pregunta.respuesta };
    setFeedback(fb); setLey(true); hablar(r.mensaje_voz, () => setLey(false));
  };

  const siguiente = () => {
    const nuevos = [...resultados, feedback]; setResultados(nuevos);
    if (casoIdx + 1 >= totalCasos) {
      const total = nuevos.reduce((s, r) => s + r.pts, 0); const max = nuevos.reduce((s, r) => s + r.max, 0); const pct = Math.round((total / max) * 100);
      agregarHist({ fecha: new Date().toISOString(), area: area.nombre, puntaje: total, maximo: max }); setPaso("resumen");
      setTimeout(() => { setLey(true); hablar(pct >= 80 ? `Evaluacion completada. Obtuviste ${total} de ${max} puntos. Excelente desempeno.` : `Evaluacion completada. Obtuviste ${total} de ${max} puntos. Repasa los temas donde tuviste dificultades.`, () => setLey(false)); }, 400);
    } else {
      const sig = casoIdx + 1; setCasoIdx(sig); setRespuesta(""); setFeedback(null);
      setTimeout(() => { setLey(true); hablar("Caso clinico numero " + (sig + 1) + ". " + casos[sig].caso + ". Pregunta: " + casos[sig].preguntas[0].texto, () => setLey(false)); }, 300);
    }
  };

  if (paso === "area") return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 20px" }}>
      <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Modo Estudiante</h2>
      <p style={{ color: "#6a8faa", fontSize: "13px", marginBottom: "24px" }}>Selecciona el area clinica para comenzar.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "14px" }}>
        {db.areas.map(a => (
          <div key={a.id} onClick={() => iniciarArea(a.id)} style={{ background: `${a.color}15`, border: `1px solid ${a.color}40`, borderRadius: "16px", padding: "24px 16px", cursor: "pointer", textAlign: "center", transition: "all 0.25s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
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
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#4a7fa5", marginBottom: "6px" }}><span>{area?.nombre}</span><span>Caso {casoIdx + 1} de {totalCasos}</span></div>
        <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}><div style={{ height: "100%", background: "linear-gradient(90deg,#63b3ed,#9f7aea)", borderRadius: "4px", width: `${(casoIdx / totalCasos) * 100}%`, transition: "width 0.4s" }} /></div>
      </div>
      <div style={{ background: "rgba(99,179,237,0.06)", border: "1px solid rgba(99,179,237,0.18)", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
        <div style={{ fontSize: "16px", color: "#63b3ed", fontWeight: 700, marginBottom: "8px" }}>📋 {caso.titulo}</div>
        <div style={{ fontSize: "14px", color: "#8ab0c8", lineHeight: 1.7 }}>{caso.caso}</div>
        <button onClick={() => { detenerVoz(); setLey(true); hablar(caso.caso + ". Pregunta: " + pregunta?.texto, () => setLey(false)); }} disabled={ley} style={{ marginTop: "10px", background: "transparent", border: "1px solid rgba(99,179,237,0.25)", color: "#63b3ed", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", opacity: ley ? 0.5 : 1 }}>{ley ? "🔊 Leyendo..." : "🔊 Escuchar caso"}</button>
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px" }}>
        <div style={{ fontSize: "11px", color: "#4a7fa5", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>Pregunta</div>
        <div style={{ fontSize: "17px", fontWeight: 600, color: "#e8eaf0", lineHeight: 1.6, marginBottom: "18px" }}>{pregunta?.texto}</div>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "12px" }}>
          <textarea value={respuesta} onChange={e => setRespuesta(e.target.value)} disabled={!!feedback} placeholder="Escribe tu respuesta o usa el microfono..." style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "14px", color: "#e8eaf0", fontFamily: "inherit", fontSize: "14px", resize: "none", outline: "none", minHeight: "80px", lineHeight: 1.6, opacity: feedback ? 0.7 : 1 }} />
          <BtnMic esc={esc} toggle={toggle} disabled={!!feedback} />
        </div>
        {esc && <div style={{ fontSize: "12px", color: "#ef4444", marginBottom: "8px", textAlign: "center" }}>🎤 Escuchando... habla ahora</div>}
        {!feedback && <button onClick={enviar} disabled={!respuesta.trim()} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#9f7aea,#7c3aed)", color: "#fff", fontFamily: "inherit", fontSize: "15px", fontWeight: 600, cursor: "pointer", opacity: !respuesta.trim() ? 0.4 : 1 }}>Enviar respuesta →</button>}
        {feedback && (
          <div style={{ background: feedback.correcto ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)", border: `1px solid ${feedback.correcto ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.3)"}`, borderRadius: "12px", padding: "20px", marginTop: "14px" }}>
            <div style={{ fontSize: "26px", fontWeight: 800, color: feedback.correcto ? "#34d399" : "#f87171", marginBottom: "8px" }}>{feedback.correcto ? "✓ CORRECTO" : "✗ INCORRECTO"}</div>
            <div style={{ fontSize: "13px", color: "#8ab0c8", marginBottom: "8px", fontStyle: "italic" }}>💡 {feedback.recomendacion}</div>
            {!feedback.correcto && <div style={{ fontSize: "13px", color: "#63b3ed", marginBottom: "10px", background: "rgba(99,179,237,0.08)", padding: "10px", borderRadius: "8px", lineHeight: 1.5 }}><strong>Respuesta esperada:</strong><br />{feedback.respuestaEsperada}</div>}
            {ley && <div style={{ fontSize: "12px", color: "#63b3ed", marginBottom: "8px" }}>🔊 Escucha el resultado...</div>}
            <button onClick={siguiente} style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: casoIdx + 1 >= totalCasos ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#63b3ed,#3b82f6)", color: "#fff", fontFamily: "inherit", fontSize: "14px", fontWeight: 700, cursor: "pointer", marginTop: "4px" }}>{casoIdx + 1 >= totalCasos ? "Ver resumen final →" : "Siguiente caso →"}</button>
          </div>
        )}
      </div>
    </div>
  );

  if (paso === "resumen") {
    const total = resultados.reduce((s, r) => s + r.pts, 0); const max = resultados.reduce((s, r) => s + r.max, 0);
    const pct = max > 0 ? Math.round((total / max) * 100) : 0; const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
    const correctos = resultados.filter(r => r.correcto).length; const incorrectos = resultados.filter(r => !r.correcto).length;
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏁</div>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Evaluacion Completada</h2>
        <p style={{ color: "#4a7fa5", fontSize: "13px", marginBottom: "28px" }}>{area?.nombre}</p>
        <div style={{ width: "140px", height: "140px", borderRadius: "50%", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", background: `conic-gradient(${color} ${pct * 3.6}deg, rgba(255,255,255,0.06) 0)`, boxShadow: `0 0 40px ${color}30` }}>
          <div style={{ width: "112px", height: "112px", borderRadius: "50%", background: "#0d1a2e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: "11px", color: "#4a7fa5" }}>{total}/{max} pts</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "24px" }}>
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "14px 24px" }}><div style={{ fontSize: "28px", fontWeight: 800, color: "#34d399" }}>{correctos}</div><div style={{ fontSize: "12px", color: "#4a7fa5" }}>Correctos</div></div>
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "14px 24px" }}><div style={{ fontSize: "28px", fontWeight: 800, color: "#f87171" }}>{incorrectos}</div><div style={{ fontSize: "12px", color: "#4a7fa5" }}>Incorrectos</div></div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", marginBottom: "20px", textAlign: "left" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#4a7fa5", marginBottom: "14px" }}>Detalle por caso</div>
          {resultados.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: i < resultados.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", gap: "10px" }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: "13px", color: "#c8d8e8", marginBottom: "2px" }}>{r.caso}</div><div style={{ fontSize: "11px", color: "#4a7fa5", fontStyle: "italic" }}>{r.recomendacion}</div></div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: r.correcto ? "#34d399" : "#f87171", flexShrink: 0 }}>{r.correcto ? "✓" : "✗"}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)", borderRadius: "12px", padding: "16px", marginBottom: "20px", textAlign: "left" }}>
          <div style={{ fontSize: "13px", color: "#63b3ed", fontWeight: 600, marginBottom: "6px" }}>📚 Recomendacion</div>
          <div style={{ fontSize: "13px", color: "#8ab0c8", lineHeight: 1.5 }}>{pct >= 80 ? "Excelente manejo de los casos clinicos. Sigue practicando." : pct >= 60 ? "Buen desempeno. Repasa los casos que fallaste." : "Necesitas reforzar los temas. Revisa el material de clase."}</div>
        </div>
        <button onClick={() => { setPaso("area"); setResultados([]); }} style={{ width: "100%", padding: "14px", borderRadius: "30px", border: "none", background: "linear-gradient(135deg,#63b3ed,#3b82f6)", color: "#fff", fontFamily: "inherit", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>Evaluar otra area →</button>
      </div>
    );
  }
  return null;
}

function Pin({ onOk }) {
  const [pin, setPin] = useState(""); const [err, setErr] = useState(false);
  const check = () => { if (pin === ADMIN_PIN) onOk(); else { setErr(true); setPin(""); } };
  return (
    <div style={{ maxWidth: "320px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔐</div>
      <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Panel Docente</div>
      <div style={{ fontSize: "13px", color: "#6a8faa", marginBottom: "28px" }}>Ingresa tu PIN para administrar los casos</div>
      <input type="password" value={pin} onChange={e => { setPin(e.target.value); setErr(false); }} onKeyDown={e => e.key === "Enter" && check()} maxLength={6} placeholder="••••" style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${err ? "#ef4444" : "rgba(255,255,255,0.15)"}`, borderRadius: "12px", padding: "16px", color: "#e8eaf0", fontSize: "24px", textAlign: "center", letterSpacing: "8px", outline: "none", fontFamily: "inherit", marginBottom: "10px" }} />
      {err && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "10px" }}>PIN incorrecto.</div>}
      <button onClick={check} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Acceder →</button>
      <div style={{ marginTop: "12px", fontSize: "11px", color: "#3a5a7a" }}>PIN por defecto: 1234</div>
    </div>
  );
}

function Admin({ db, actualizarDB, toast }) {
  const [tab, setTab] = useState(db.areas[0]?.id || ""); const [abierto, setAbierto] = useState(null);
  const area = db.areas.find(a => a.id === tab);
  const updCaso = (cid, f, v) => actualizarDB({ ...db, areas: db.areas.map(a => a.id !== tab ? a : { ...a, casos: a.casos.map(c => c.id !== cid ? c : { ...c, [f]: v }) }) });
  const updQ = (cid, f, v) => actualizarDB({ ...db, areas: db.areas.map(a => a.id !== tab ? a : { ...a, casos: a.casos.map(c => { if (c.id !== cid) return c; const q = { ...c.preguntas[0], [f]: f === "puntaje" ? parseInt(v) || 0 : v }; return { ...c, preguntas: [q] }; }) }) });
  const updPalabras = (cid, v) => actualizarDB({ ...db, areas: db.areas.map(a => a.id !== tab ? a : { ...a, casos: a.casos.map(c => { if (c.id !== cid) return c; const q = { ...c.preguntas[0], palabrasClave: v.split(",").map(p => p.trim()).filter(Boolean) }; return { ...c, preguntas: [q] }; }) }) });
  const addCaso = () => { const id = "c" + Date.now(); actualizarDB({ ...db, areas: db.areas.map(a => a.id !== tab ? a : { ...a, casos: [...a.casos, { id, titulo: "Nuevo caso", caso: "", preguntas: [{ texto: "", respuesta: "", puntaje: 10, palabrasClave: [] }] }] }) }); setAbierto(id); toast("Caso agregado"); };
  const delCaso = cid => { if (!confirm("Eliminar este caso?")) return; actualizarDB({ ...db, areas: db.areas.map(a => a.id !== tab ? a : { ...a, casos: a.casos.filter(c => c.id !== cid) }) }); toast("Eliminado"); };
  const reset = () => { if (!confirm("Restaurar base de datos original?")) return; actualizarDB(INITIAL_DB); toast("Restaurado"); };
  const inp = { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "10px 14px", color: "#e8eaf0", fontFamily: "inherit", fontSize: "14px", outline: "none", marginBottom: "10px" };
  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "10px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff" }}>Panel Docente</h2>
        <button onClick={reset} style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "#f87171", fontFamily: "inherit", fontSize: "12px", cursor: "pointer" }}>Restaurar original</button>
      </div>
      <p style={{ color: "#6a8faa", fontSize: "13px", marginBottom: "20px" }}>Agrega palabras clave separadas por coma para la evaluacion automatica.</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {db.areas.map(a => <button key={a.id} onClick={() => setTab(a.id)} style={{ padding: "7px 14px", borderRadius: "20px", border: `1px solid ${tab === a.id ? a.color + "80" : "rgba(255,255,255,0.1)"}`, background: tab === a.id ? a.color + "20" : "transparent", color: tab === a.id ? "#e8eaf0" : "#6a8faa", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", fontWeight: tab === a.id ? 600 : 400 }}>{a.icon} {a.nombre}</button>)}
      </div>
      {area && (
        <>
          <button onClick={addCaso} style={{ marginBottom: "16px", padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(99,179,237,0.35)", background: "transparent", color: "#63b3ed", fontFamily: "inherit", fontSize: "13px", cursor: "pointer" }}>+ Agregar caso</button>
          {area.casos.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "#4a7fa5" }}>No hay casos.</div>}
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
                  <textarea style={{ ...inp, resize: "vertical", minHeight: "70px", lineHeight: 1.5 }} value={c.caso} onChange={e => updCaso(c.id, "caso", e.target.value)} placeholder="Describe el caso clinico..." />
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#4a7fa5", display: "block", marginBottom: "5px" }}>Pregunta</label>
                  <input style={inp} value={c.preguntas[0]?.texto || ""} onChange={e => updQ(c.id, "texto", e.target.value)} placeholder="Pregunta de evaluacion..." />
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#4a7fa5", display: "block", marginBottom: "5px" }}>Respuesta esperada</label>
                  <textarea style={{ ...inp, resize: "vertical", minHeight: "60px", lineHeight: 1.5 }} value={c.preguntas[0]?.respuesta || ""} onChange={e => updQ(c.id, "respuesta", e.target.value)} placeholder="Respuesta completa esperada..." />
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#4a7fa5", display: "block", marginBottom: "5px" }}>Palabras clave (separadas por coma)</label>
                  <input style={inp} value={(c.preguntas[0]?.palabrasClave || []).join(", ")} onChange={e => updPalabras(c.id, e.target.value)} placeholder="ej: contracciones, liquido amniotico, trabajo de parto" />
                  <div style={{ fontSize: "11px", color: "#3a6a8a", marginBottom: "10px" }}>✓ Correcto si el estudiante menciona al menos el 40% de las palabras clave.</div>
                  <label style={{ fontSize: "12px", color: "#6a8faa", display: "flex", alignItems: "center", gap: "8px" }}>Puntaje: <input type="number" min="1" max="20" value={c.preguntas[0]?.puntaje || 10} onChange={e => updQ(c.id, "puntaje", e.target.value)} style={{ ...inp, width: "70px", marginBottom: 0, textAlign: "center", padding: "6px" }} /></label>
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
      <div style={{ textAlign: "center", padding: "60px", color: "#4a7fa5" }}><div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>No hay evaluaciones registradas aun.</div>
    </div>
  );
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "32px 20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Historial</h2>
      <p style={{ color: "#6a8faa", fontSize: "13px", marginBottom: "20px" }}>{historial.length} evaluacion(es)</p>
      {historial.map((h, i) => {
        const pct = Math.round((h.puntaje / h.maximo) * 100); const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
        return (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 20px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, color: "#c8d8e8", marginBottom: "4px", fontSize: "14px" }}>{h.area}</div><div style={{ fontSize: "12px", color: "#4a7fa5" }}>{new Date(h.fecha).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" })}</div></div>
            <div style={{ textAlign: "right", flexShrink: 0 }}><div style={{ fontSize: "20px", fontWeight: 700, color }}>{pct}%</div><div style={{ fontSize: "11px", color: "#4a7fa5" }}>{h.puntaje}/{h.maximo} pts</div></div>
          </div>
        );
      })}
    </div>
  );
}
