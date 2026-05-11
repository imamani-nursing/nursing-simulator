import { useState, useEffect, useRef } from "react";

const INITIAL_DB = {
  areas: [
    {
      id: "pediatria", nombre: "Pediatria", icon: "👶", color: "#1A5276",
      casos: [
        {
          id: "p1", titulo: "Neumonia Infantil",
          caso: "Nino de 2 anos con fiebre de 39.2C, tos productiva de 3 dias y dificultad respiratoria progresiva. FR: 52 rpm, FC: 128 lpm, SatO2: 91%, tiraje intercostal positivo.",
          preguntas: [
            { texto: "Cual es el diagnostico probable segun criterios AIEPI?", respuesta: "Neumonia grave segun criterios AIEPI por FR elevada, fiebre y dificultad respiratoria.", puntaje: 3 },
            { texto: "Que signo clinico indica mayor gravedad?", respuesta: "El tiraje intercostal positivo con SatO2 de 91% indica compromiso respiratorio grave con hipoxemia.", puntaje: 3 },
            { texto: "Cual es la primera intervencion de enfermeria prioritaria?", respuesta: "Administrar oxigeno para mantener SatO2 mayor a 95%, controlar signos vitales y referir urgente segun protocolo AIEPI.", puntaje: 4 }
          ]
        },
        {
          id: "p2", titulo: "Deshidratacion por Diarrea",
          caso: "Lactante de 8 meses con diarrea liquida desde hace 48 horas. Ojos hundidos, llanto sin lagrimas, mucosas secas. T: 37.8C, FC: 140 lpm.",
          preguntas: [
            { texto: "Cual es el grado de deshidratacion segun clasificacion OMS?", respuesta: "Deshidratacion moderada con al menos 2 signos como ojos hundidos, llanto sin lagrimas y pliegue positivo.", puntaje: 3 },
            { texto: "Cuales son los dos signos clinicos mas relevantes?", respuesta: "Ojos hundidos y signo del pliegue cutaneo positivo que tarda mas de 2 segundos en volver.", puntaje: 3 },
            { texto: "Cual es el tratamiento de rehidratacion indicado?", respuesta: "Plan B: Sales de Rehidratacion Oral 75 ml por kilo en 4 horas con control estricto cada 30 minutos.", puntaje: 4 }
          ]
        }
      ]
    },
    {
      id: "gineco", nombre: "Ginecoobstetricia", icon: "🤱", color: "#6C3483",
      casos: [
        {
          id: "g1", titulo: "Preeclampsia Severa",
          caso: "Gestante de 34 semanas. PA: 165/108 mmHg, cefalea intensa, vision borrosa, epigastralgia. Edema en miembros inferiores y cara. Proteinuria +++.",
          preguntas: [
            { texto: "Cual es el diagnostico y como se diferencia de la preeclampsia leve?", respuesta: "Preeclampsia severa: PA mayor o igual a 160/110 con proteinuria y sintomas como cefalea y alteraciones visuales.", puntaje: 3 },
            { texto: "Cual es el riesgo materno-fetal mas grave e inmediato?", respuesta: "Riesgo de eclampsia con convulsiones, sindrome HELLP y desprendimiento prematuro de placenta.", puntaje: 3 },
            { texto: "Cuales son las intervenciones de enfermeria prioritarias?", respuesta: "Control estricto de PA cada 15 minutos, canalizar via venosa, preparar sulfato de magnesio y referencia urgente.", puntaje: 4 }
          ]
        }
      ]
    },
    {
      id: "quirurgica", nombre: "Instrumentacion Quirurgica", icon: "🏥", color: "#1E8449",
      casos: [
        {
          id: "q1", titulo: "Conteo Incorrecto de Gasas",
          caso: "Durante cierre de laparotomia exploradora, el conteo inicial fue de 20 gasas. Al conteo final: 19 gasas. El cirujano esta listo para suturar la fascia.",
          preguntas: [
            { texto: "Cual es la accion inmediata que debe tomar la instrumentadora?", respuesta: "Suspender inmediatamente el cierre e informar al cirujano del conteo incorrecto de forma clara y firme.", puntaje: 4 },
            { texto: "Que protocolo debe activarse ante un conteo incorrecto?", respuesta: "Reconteo sistematico en campo, instrumental y residuos; solicitar radiografia intraoperatoria si no se localiza.", puntaje: 3 },
            { texto: "Como se documenta este evento en el registro quirurgico?", respuesta: "Registrar hora de conteo, discrepancia detectada, acciones tomadas y resolucion del incidente con firma del equipo.", puntaje: 3 }
          ]
        }
      ]
    },
    {
      id: "materno", nombre: "Materno Infantil", icon: "👩‍👦", color: "#B7950B",
      casos: [
        {
          id: "m1", titulo: "Tecnica de Lactancia Materna",
          caso: "Madre primipara de 19 anos, dia 3 postparto. Dolor intenso en pezones al amamantar. El bebe succiona solo el pezon sin abarcar la areola.",
          preguntas: [
            { texto: "Cual es el problema identificado en la tecnica de lactancia?", respuesta: "Mala tecnica de agarre: el bebe succiona solo el pezon sin incluir la areola, causando dolor y produccion insuficiente.", puntaje: 3 },
            { texto: "Como se corrige la posicion y el agarre del bebe?", respuesta: "Madre erguida con espalda apoyada, bebe alineado abdomen contra abdomen, boca amplia abarcando pezon mas areola con labios evertidos.", puntaje: 4 },
            { texto: "Que educacion brinda enfermeria sobre los beneficios de la lactancia exclusiva?", respuesta: "Proteccion contra infecciones, reduce alergias y obesidad, fortalece vinculo materno-infantil.", puntaje: 3 }
          ]
        }
      ]
    },
    {
      id: "primeros", nombre: "Primeros Auxilios", icon: "🚑", color: "#922B21",
      casos: [
        {
          id: "a1", titulo: "Paro Cardiorrespiratorio",
          caso: "Hombre de 60 anos colapsa en la via publica. Inconsciente, sin respuesta, sin respiracion normal. No se palpa pulso carotideo en 10 segundos.",
          preguntas: [
            { texto: "Cuales son los criterios para confirmar el PCR?", respuesta: "Inconsciencia, ausencia de respiracion normal y ausencia de pulso en 10 segundos. Activar SEM, iniciar RCP y conseguir DEA.", puntaje: 3 },
            { texto: "Cual es la secuencia correcta de RCP basica del adulto segun AHA 2020?", respuesta: "Secuencia C-A-B: 30 compresiones de 5-6 cm a 100-120 por minuto mas 2 ventilaciones, relacion 30:2.", puntaje: 4 },
            { texto: "Como se usa el DEA?", respuesta: "Encender, colocar electrodos, alejarse para analisis del ritmo, aplicar descarga si indica y reanudar RCP inmediatamente.", puntaje: 3 }
          ]
        }
      ]
    }
  ]
};

const ADMIN_PIN = "1234";

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES"; u.rate = 0.92; u.pitch = 1;
  window.speechSynthesis.speak(u);
}

async function callAI(prompt) {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
    });
    const d = await r.json();
    return d.content.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
  } catch { return '{"error": true}'; }
}

async function evalAnswer(pregunta, respuestaEsperada, respuestaEstudiante) {
  try {
    const txt = await callAI(`Eres evaluador de enfermeria. Evalua si la respuesta del estudiante es correcta.
PREGUNTA: ${pregunta}
RESPUESTA ESPERADA: ${respuestaEsperada}
RESPUESTA DEL ESTUDIANTE: ${respuestaEstudiante}
Responde SOLO en JSON sin backticks: {"correcto": true, "mensaje": "frase corta para voz", "retroalimentacion": "explicacion breve"}`);
    return JSON.parse(txt);
  } catch { return { correcto: false, mensaje: "No pude evaluar. Intentalo de nuevo.", retroalimentacion: "" }; }
}

async function consultaGeneral(sintomas) {
  try {
    const txt = await callAI(`Eres asistente de orientacion en salud. Analiza los sintomas.
SINTOMAS: ${sintomas}
Responde SOLO en JSON sin backticks: {"condicion": "posible condicion", "descripcion": "descripcion breve", "recomendaciones": ["rec1","rec2","rec3"], "urgencia": "baja", "mensaje_voz": "mensaje breve incluyendo que deben consultar a un medico"}`);
    return JSON.parse(txt);
  } catch { return { condicion: "Error", descripcion: "No se pudo procesar.", recomendaciones: ["Consulte a un medico"], urgencia: "media", mensaje_voz: "Por favor consulte a un profesional de salud." }; }
}

async function saveDB(db) { try { await window.storage.set("loyolasim_db", JSON.stringify(db)); } catch {} }
async function loadDB() { try { const r = await window.storage.get("loyolasim_db"); return r ? JSON.parse(r.value) : null; } catch { return null; } }
async function saveHist(h) { try { await window.storage.set("loyolasim_hist", JSON.stringify(h)); } catch {} }
async function loadHist() { try { const r = await window.storage.get("loyolasim_hist"); return r ? JSON.parse(r.value) : []; } catch { return []; } }

export default function App() {
  const [view, setView] = useState("home");
  const [db, setDB] = useState(null);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [adminOk, setAdminOk] = useState(false);

  useEffect(() => {
    (async () => {
      setDB(await loadDB() || INITIAL_DB);
      setHistory(await loadHist());
    })();
  }, []);

  const updDB = async (n) => { setDB(n); await saveDB(n); };
  const addHist = async (e) => { const n = [e, ...history].slice(0, 30); setHistory(n); await saveHist(n); };
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  if (!db) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0f1e",color:"#63b3ed",fontSize:"18px"}}>
      Cargando LoyolaSim Clinical...
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0f1e,#0d1a2e)",fontFamily:"system-ui,sans-serif",color:"#e8eaf0"}}>
      <nav style={{background:"rgba(10,15,30,0.95)",borderBottom:"1px solid rgba(99,179,237,0.15)",padding:"0 20px",display:"flex",alignItems:"center",gap:"8px",height:"56px",position:"sticky",top:0,zIndex:100}}>
        <div style={{marginRight:"auto"}}>
          <div style={{fontSize:"18px",fontWeight:800,color:"#63b3ed"}}>LoyolaSim Clinical</div>
          <div style={{fontSize:"10px",color:"#3a6a8a",textTransform:"uppercase",letterSpacing:"2px"}}>Simulador Clinico</div>
        </div>
        {[["home","Inicio"],["general","General"],["student","Estudiante"],["admin",adminOk?"Docente":"Docente"],["history","Historial"]].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{padding:"6px 12px",borderRadius:"16px",border:`1px solid ${view===v?"rgba(99,179,237,0.6)":"rgba(255,255,255,0.08)"}`,background:view===v?"rgba(99,179,237,0.15)":"transparent",color:view===v?"#63b3ed":"#6a8faa",fontSize:"12px",fontWeight:view===v?700:400,cursor:"pointer",whiteSpace:"nowrap"}}>
            {l}
          </button>
        ))}
      </nav>

      {view==="home" && <HomeV setView={setView} />}
      {view==="general" && <GeneralV />}
      {view==="student" && <StudentV db={db} addHist={addHist} />}
      {view==="admin" && (adminOk ? <AdminV db={db} updDB={updDB} toast={showToast} /> : <PinV onOk={()=>setAdminOk(true)} />)}
      {view==="history" && <HistoryV history={history} />}

      {toast && <div style={{position:"fixed",bottom:"24px",right:"24px",background:"#1a3a5c",border:"1px solid rgba(99,179,237,0.4)",borderRadius:"12px",padding:"12px 20px",fontSize:"13px",color:"#63b3ed",zIndex:999}}>
        {toast}
      </div>}
    </div>
  );
}

function HomeV({setView}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - 56px)",padding:"40px 24px",textAlign:"center"}}>
      <div style={{fontSize:"64px",marginBottom:"16px"}}>🏥</div>
      <h1 style={{fontSize:"clamp(32px,6vw,60px)",fontWeight:800,color:"#fff",lineHeight:1.1,marginBottom:"16px"}}>
        LoyolaSim<br/><span style={{color:"#63b3ed"}}>Clinical</span>
      </h1>
      <p style={{fontSize:"15px",color:"#6a8faa",maxWidth:"480px",marginBottom:"40px",lineHeight:1.7}}>
        Plataforma de simulacion clinica con IA para estudiantes de enfermeria. Responde con tu voz o por escrito.
      </p>
      <div style={{display:"flex",gap:"20px",flexWrap:"wrap",justifyContent:"center"}}>
        {[
          {v:"general",icon:"🩺",title:"Modo General",desc:"Orientacion basica en salud para el publico general.",color:"#63b3ed"},
          {v:"student",icon:"🎓",title:"Modo Estudiante",desc:"Practica casos clinicos con evaluacion por IA.",color:"#9f7aea"}
        ].map(({v,icon,title,desc,color})=>(
          <div key={v} onClick={()=>setView(v)} style={{background:`${color}12`,border:`1px solid ${color}30`,borderRadius:"20px",padding:"32px 28px",cursor:"pointer",minWidth:"240px",maxWidth:"280px",flex:1,transition:"all 0.3s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor=color+"60";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=color+"30";}}>
            <div style={{fontSize:"40px",marginBottom:"12px"}}>{icon}</div>
            <div style={{fontSize:"22px",fontWeight:700,color:"#fff",marginBottom:"8px"}}>{title}</div>
            <div style={{fontSize:"13px",color:"#6a8faa",lineHeight:1.5,marginBottom:"16px"}}>{desc}</div>
            <div style={{fontSize:"13px",color,fontWeight:600}}>Ingresar →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function useMic(onResult) {
  const ref = useRef(null);
  const [listening, setListening] = useState(false);
  const toggle = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Usa Chrome para reconocimiento de voz.");
      return;
    }
    if (listening) { ref.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR(); r.lang = "es-ES"; r.continuous = false; r.interimResults = false;
    r.onresult = e => onResult(e.results[0][0].transcript);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    ref.current = r; r.start(); setListening(true);
  };
  return [listening, toggle];
}

function MicBtn({listening, onToggle, disabled}) {
  return (
    <button onClick={onToggle} disabled={disabled} style={{width:"44px",height:"44px",borderRadius:"50%",border:`2px solid ${listening?"#ef4444":"rgba(99,179,237,0.4)"}`,background:listening?"rgba(239,68,68,0.15)":"transparent",color:listening?"#ef4444":"#63b3ed",fontSize:"18px",cursor:disabled?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      {listening ? "🔴" : "🎤"}
    </button>
  );
}

function GeneralV() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [listening, toggleMic] = useMic(t => setText(p => p ? p + " " + t : t));

  const send = async () => {
    if (!text.trim()) return;
    setLoading(true); setResult(null);
    const r = await consultaGeneral(text);
    setResult(r); setLoading(false);
    speak(r.mensaje_voz);
  };

  const urgColors = {alta:"#ef4444", media:"#f59e0b", baja:"#10b981"};

  return (
    <div style={{maxWidth:"680px",margin:"0 auto",padding:"40px 24px"}}>
      <h2 style={{fontSize:"28px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>Orientacion en Salud</h2>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"24px"}}>Describe los sintomas. Recibiras orientacion basica — no reemplaza la consulta medica.</p>
      <div style={{background:"rgba(99,179,237,0.05)",border:"1px solid rgba(99,179,237,0.18)",borderRadius:"16px",padding:"20px"}}>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Ej: Tengo fiebre de 38.5C desde hace 2 dias, dolor de cabeza intenso..." style={{width:"100%",background:"transparent",border:"none",color:"#e8eaf0",fontFamily:"inherit",fontSize:"15px",resize:"none",outline:"none",minHeight:"90px",lineHeight:1.6}}/>
        <div style={{display:"flex",gap:"10px",marginTop:"12px",alignItems:"center"}}>
          <MicBtn listening={listening} onToggle={toggleMic}/>
          <button onClick={send} disabled={loading||!text.trim()} style={{flex:1,padding:"12px 20px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#3b82f6,#2563eb)",color:"#fff",fontFamily:"inherit",fontSize:"14px",fontWeight:600,cursor:"pointer",opacity:loading||!text.trim()?0.5:1}}>
            {loading ? "Analizando..." : "Consultar →"}
          </button>
        </div>
      </div>
      {loading && <div style={{textAlign:"center",padding:"24px",color:"#63b3ed"}}>Procesando consulta...</div>}
      {result && (
        <div style={{marginTop:"20px",background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:"16px",padding:"24px"}}>
          <span style={{background:`${urgColors[result.urgencia]}20`,color:urgColors[result.urgencia],padding:"3px 12px",borderRadius:"20px",fontSize:"11px",fontWeight:700,textTransform:"uppercase"}}>
            {result.urgencia === "alta" ? "Urgencia Alta" : result.urgencia === "media" ? "Urgencia Media" : "Urgencia Baja"}
          </span>
          <div style={{fontSize:"22px",color:"#34d399",margin:"12px 0 6px",fontWeight:700}}>{result.condicion}</div>
          <div style={{fontSize:"14px",color:"#8ab0c8",marginBottom:"16px",lineHeight:1.6}}>{result.descripcion}</div>
          {result.recomendaciones?.map((r,i) => (
            <div key={i} style={{display:"flex",gap:"8px",padding:"8px 0",fontSize:"14px",color:"#b0c8dc",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              <span style={{color:"#34d399"}}>→</span>{r}
            </div>
          ))}
          <div style={{marginTop:"16px",padding:"10px",background:"rgba(234,179,8,0.08)",borderRadius:"8px",fontSize:"12px",color:"#ca8a04",borderLeft:"3px solid #ca8a04"}}>
            Esta informacion es orientativa. Consulta siempre a un profesional de salud.
          </div>
          <button onClick={()=>speak(result.mensaje_voz)} style={{marginTop:"14px",padding:"8px 18px",borderRadius:"10px",border:"1px solid rgba(99,179,237,0.3)",background:"transparent",color:"#63b3ed",fontFamily:"inherit",fontSize:"13px",cursor:"pointer"}}>
            Escuchar respuesta
          </button>
        </div>
      )}
    </div>
  );
}

function StudentV({db, addHist}) {
  const [step, setStep] = useState("area");
  const [areaId, setAreaId] = useState(null);
  const [caseId, setCaseId] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [ans, setAns] = useState("");
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, toggleMic] = useMic(t => setAns(p => p ? p + " " + t : t));

  const area = db.areas.find(a => a.id === areaId);
  const caso = area?.casos.find(c => c.id === caseId);
  const q = caso?.preguntas[qIdx];

  const startCase = (aid, cid) => {
    setAreaId(aid); setCaseId(cid); setQIdx(0); setAns(""); setAnswers([]); setFeedback(null); setStep("eval");
    const c = db.areas.find(a => a.id === aid)?.casos.find(c => c.id === cid);
    if (c) speak("Inicio de evaluacion. " + c.caso);
  };

  const submit = async () => {
    if (!ans.trim() || !q) return;
    setLoading(true); setFeedback(null);
    const r = await evalAnswer(q.texto, q.respuesta, ans);
    setFeedback({...r, pts: r.correcto ? q.puntaje : 0, max: q.puntaje});
    speak(r.mensaje); setLoading(false);
  };

  const next = () => {
    const newAnswers = [...answers, {...feedback, pregunta: q.texto}];
    setAnswers(newAnswers);
    if (qIdx + 1 >= caso.preguntas.length) {
      const total = newAnswers.reduce((s,a) => s + a.pts, 0);
      const max = newAnswers.reduce((s,a) => s + a.max, 0);
      addHist({date: new Date().toISOString(), area: area.nombre, caso: caso.titulo, puntaje: total, max});
      setAnswers(newAnswers); setStep("score");
    } else {
      setQIdx(qIdx + 1); setFeedback(null); setAns("");
      speak(caso.preguntas[qIdx + 1].texto);
    }
  };

  if (step === "area") return (
    <div style={{maxWidth:"800px",margin:"0 auto",padding:"40px 24px"}}>
      <h2 style={{fontSize:"28px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>Modo Estudiante</h2>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"24px"}}>Selecciona el area clinica que deseas evaluar</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"14px"}}>
        {db.areas.map(a => (
          <div key={a.id} onClick={()=>{setAreaId(a.id); setStep("case");}} style={{background:`${a.color}12`,border:`1px solid ${a.color}35`,borderRadius:"16px",padding:"24px 16px",cursor:"pointer",textAlign:"center",transition:"all 0.25s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
            onMouseLeave={e=>e.currentTarget.style.transform=""}>
            <div style={{fontSize:"36px",marginBottom:"10px"}}>{a.icon}</div>
            <div style={{fontSize:"13px",fontWeight:600,color:"#c8d8e8",marginBottom:"4px"}}>{a.nombre}</div>
            <div style={{fontSize:"11px",color:"#4a7fa5"}}>{a.casos.length} casos</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (step === "case") return (
    <div style={{maxWidth:"700px",margin:"0 auto",padding:"40px 24px"}}>
      <button onClick={()=>setStep("area")} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.12)",color:"#6a8faa",borderRadius:"8px",padding:"7px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:"13px",marginBottom:"24px"}}>
        Volver
      </button>
      <h2 style={{fontSize:"26px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>{area?.nombre}</h2>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"20px"}}>Selecciona un caso clinico</p>
      {area?.casos.map(c => {
        const total = c.preguntas.reduce((s,q) => s + q.puntaje, 0);
        return (
          <div key={c.id} onClick={()=>startCase(area.id, c.id)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"18px 22px",marginBottom:"10px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(99,179,237,0.08)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";}}>
            <div>
              <div style={{fontSize:"14px",fontWeight:600,color:"#c8d8e8",marginBottom:"3px"}}>{c.titulo}</div>
              <div style={{fontSize:"12px",color:"#4a7fa5"}}>{c.preguntas.length} preguntas · {total} puntos</div>
            </div>
            <span style={{color:"#4a7fa5",fontSize:"20px"}}>›</span>
          </div>
        );
      })}
    </div>
  );

  if (step === "eval" && caso) {
    const pct = (qIdx / caso.preguntas.length) * 100;
    return (
      <div style={{maxWidth:"720px",margin:"0 auto",padding:"40px 24px"}}>
        <div style={{background:"rgba(99,179,237,0.05)",border:"1px solid rgba(99,179,237,0.15)",borderRadius:"16px",padding:"20px",marginBottom:"20px"}}>
          <div style={{fontSize:"20px",color:"#63b3ed",fontWeight:700,marginBottom:"8px"}}>{caso.titulo}</div>
          <div style={{fontSize:"14px",color:"#8ab0c8",lineHeight:1.7,fontStyle:"italic"}}>{caso.caso}</div>
          <button onClick={()=>speak(caso.caso)} style={{marginTop:"10px",background:"transparent",border:"1px solid rgba(99,179,237,0.25)",color:"#63b3ed",borderRadius:"8px",padding:"6px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:"12px"}}>
            Escuchar caso
          </button>
        </div>
        <div style={{marginBottom:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"12px",color:"#4a7fa5",marginBottom:"6px"}}>
            <span>Pregunta {qIdx+1} de {caso.preguntas.length}</span><span>{Math.round(pct)}%</span>
          </div>
          <div style={{height:"4px",background:"rgba(255,255,255,0.08)",borderRadius:"4px",overflow:"hidden"}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,#63b3ed,#9f7aea)",borderRadius:"4px",width:pct+"%",transition:"width 0.4s"}}/>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"16px",padding:"24px"}}>
          <div style={{fontSize:"11px",color:"#4a7fa5",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"8px"}}>Pregunta {qIdx+1}</div>
          <div style={{fontSize:"16px",fontWeight:500,color:"#e8eaf0",lineHeight:1.6,marginBottom:"6px"}}>{q?.texto}</div>
          <div style={{fontSize:"12px",color:"#ca8a04",marginBottom:"16px"}}>Valor: {q?.puntaje} puntos</div>
          <div style={{display:"flex",gap:"10px",alignItems:"flex-start",marginBottom:"12px"}}>
            <textarea value={ans} onChange={e=>setAns(e.target.value)} disabled={!!feedback} placeholder="Escribe tu respuesta o usa el microfono..." style={{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"12px",padding:"14px",color:"#e8eaf0",fontFamily:"inherit",fontSize:"14px",resize:"none",outline:"none",minHeight:"90px",lineHeight:1.6}}/>
            <MicBtn listening={listening} onToggle={toggleMic} disabled={!!feedback}/>
          </div>
          {!feedback && (
            <button onClick={submit} disabled={loading||!ans.trim()} style={{width:"100%",padding:"12px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#9f7aea,#7c3aed)",color:"#fff",fontFamily:"inherit",fontSize:"14px",fontWeight:600,cursor:"pointer",opacity:loading||!ans.trim()?0.4:1}}>
              {loading ? "Evaluando con IA..." : "Enviar respuesta →"}
            </button>
          )}
          {loading && <div style={{textAlign:"center",padding:"16px",color:"#9f7aea"}}>Evaluando respuesta...</div>}
          {feedback && (
            <div style={{background:feedback.correcto?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.08)",border:`1px solid ${feedback.correcto?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.25)"}`,borderRadius:"12px",padding:"16px",marginTop:"14px"}}>
              <div style={{fontSize:"16px",fontWeight:700,color:feedback.correcto?"#34d399":"#f87171",marginBottom:"6px"}}>
                {feedback.correcto ? "Correcto!" : "Incorrecto"} — {feedback.pts}/{feedback.max} pts
              </div>
              <div style={{fontSize:"13px",color:"#8ab0c8",lineHeight:1.5,marginBottom:"14px"}}>{feedback.retroalimentacion}</div>
              <button onClick={next} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:feedback.correcto?"linear-gradient(135deg,#10b981,#059669)":"linear-gradient(135deg,#6366f1,#4f46e5)",color:"#fff",fontFamily:"inherit",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>
                {qIdx+1>=caso.preguntas.length ? "Ver resultados →" : "Siguiente pregunta →"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === "score") {
    const total = answers.reduce((s,a) => s + a.pts, 0);
    const max = answers.reduce((s,a) => s + a.max, 0);
    const pct = max > 0 ? Math.round((total/max)*100) : 0;
    const color = pct>=80?"#10b981":pct>=60?"#f59e0b":"#ef4444";
    const grade = pct>=90?"Excelente":pct>=80?"Muy Bien":pct>=60?"Aprobado":"Necesita mejorar";
    return (
      <div style={{maxWidth:"580px",margin:"0 auto",padding:"40px 24px",textAlign:"center"}}>
        <h2 style={{fontSize:"24px",color:"#fff",marginBottom:"4px"}}>{caso?.titulo}</h2>
        <p style={{color:"#4a7fa5",fontSize:"13px",marginBottom:"28px"}}>{area?.nombre}</p>
        <div style={{width:"140px",height:"140px",borderRadius:"50%",margin:"0 auto 24px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`conic-gradient(${color} ${pct*3.6}deg, rgba(255,255,255,0.06) 0)`,boxShadow:`0 0 40px ${color}30`}}>
          <div style={{width:"112px",height:"112px",borderRadius:"50%",background:"#0d1a2e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:"40px",fontWeight:800,color:"#fff",lineHeight:1}}>{total}</div>
            <div style={{fontSize:"12px",color:"#4a7fa5"}}>de {max} pts</div>
          </div>
        </div>
        <div style={{fontSize:"24px",fontWeight:700,color,marginBottom:"8px"}}>{grade}</div>
        <div style={{fontSize:"14px",color:"#6a8faa",marginBottom:"28px"}}>{pct}% de respuestas correctas</div>
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"20px",marginBottom:"20px",textAlign:"left"}}>
          {answers.map((a,i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<answers.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
              <div style={{fontSize:"13px",color:"#8ab0c8",flex:1,marginRight:"12px"}}>{a.pregunta}</div>
              <div style={{fontWeight:700,fontSize:"14px",color:a.pts>0?"#34d399":"#f87171",flexShrink:0}}>{a.pts}/{a.max}</div>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 0",borderTop:"2px solid rgba(255,255,255,0.1)",marginTop:"8px"}}>
            <div style={{fontWeight:700,color:"#c8d8e8"}}>TOTAL</div>
            <div style={{fontSize:"18px",fontWeight:800,color}}>{total}/{max}</div>
          </div>
        </div>
        <button onClick={()=>setStep("case")} style={{width:"100%",padding:"14px",borderRadius:"30px",border:"none",background:"linear-gradient(135deg,#63b3ed,#3b82f6)",color:"#fff",fontFamily:"inherit",fontSize:"15px",fontWeight:700,cursor:"pointer",marginBottom:"10px"}}>
          Evaluar otro caso
        </button>
        <button onClick={()=>setStep("area")} style={{width:"100%",padding:"10px",borderRadius:"30px",border:"1px solid rgba(99,179,237,0.3)",background:"transparent",color:"#63b3ed",fontFamily:"inherit",fontSize:"14px",cursor:"pointer"}}>
          Cambiar area
        </button>
      </div>
    );
  }

  return null;
}

function PinV({onOk}) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const check = () => { if (pin === ADMIN_PIN) onOk(); else { setErr(true); setPin(""); } };
  return (
    <div style={{maxWidth:"320px",margin:"0 auto",padding:"80px 24px",textAlign:"center"}}>
      <div style={{fontSize:"48px",marginBottom:"16px"}}>🔐</div>
      <div style={{fontSize:"24px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>Panel Docente</div>
      <div style={{fontSize:"14px",color:"#6a8faa",marginBottom:"28px"}}>Ingresa tu PIN para administrar la base de datos</div>
      <input type="password" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()} maxLength={6} placeholder="••••" style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"12px",padding:"16px",color:"#e8eaf0",fontSize:"22px",textAlign:"center",letterSpacing:"8px",outline:"none",fontFamily:"inherit",marginBottom:"10px"}}/>
      {err && <div style={{color:"#f87171",fontSize:"13px",marginBottom:"10px"}}>PIN incorrecto.</div>}
      <button onClick={check} style={{width:"100%",padding:"14px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#3b82f6,#2563eb)",color:"#fff",fontSize:"15px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
        Acceder →
      </button>
      <div style={{marginTop:"12px",fontSize:"11px",color:"#3a5a7a"}}>PIN por defecto: 1234</div>
    </div>
  );
}

function AdminV({db, updDB, toast}) {
  const [tab, setTab] = useState(db.areas[0]?.id || "");
  const [open, setOpen] = useState(null);
  const area = db.areas.find(a => a.id === tab);

  const updCase = (cid,field,val) => updDB({...db,areas:db.areas.map(a=>a.id!==tab?a:{...a,casos:a.casos.map(c=>c.id!==cid?c:{...c,[field]:val})})});
  const updQ = (cid,qi,field,val) => updDB({...db,areas:db.areas.map(a=>a.id!==tab?a:{...a,casos:a.casos.map(c=>{if(c.id!==cid)return c;const qs=[...c.preguntas];qs[qi]={...qs[qi],[field]:field==="puntaje"?parseInt(val)||0:val};return{...c,preguntas:qs};})})});
  const addQ = (cid) => updDB({...db,areas:db.areas.map(a=>a.id!==tab?a:{...a,casos:a.casos.map(c=>c.id!==cid?c:{...c,preguntas:[...c.preguntas,{texto:"",respuesta:"",puntaje:3}]})})});
  const delQ = (cid,qi) => updDB({...db,areas:db.areas.map(a=>a.id!==tab?a:{...a,casos:a.casos.map(c=>c.id!==cid?c:{...c,preguntas:c.preguntas.filter((_,i)=>i!==qi)})})});
  const addCase = () => { const id="c"+Date.now(); updDB({...db,areas:db.areas.map(a=>a.id!==tab?a:{...a,casos:[...a.casos,{id,titulo:"Nuevo caso",caso:"",preguntas:[{texto:"",respuesta:"",puntaje:3}]}]})}); setOpen(id); toast("Caso agregado"); };
  const delCase = (cid) => { if(!confirm("Eliminar este caso?"))return; updDB({...db,areas:db.areas.map(a=>a.id!==tab?a:{...a,casos:a.casos.filter(c=>c.id!==cid)})}); toast("Caso eliminado"); };
  const reset = () => { if(!confirm("Restaurar base de datos original?"))return; updDB(INITIAL_DB); toast("Restaurado"); };

  const inp = {width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",padding:"10px 14px",color:"#e8eaf0",fontFamily:"inherit",fontSize:"14px",outline:"none",marginBottom:"10px"};

  return (
    <div style={{maxWidth:"860px",margin:"0 auto",padding:"40px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
        <h2 style={{fontSize:"28px",fontWeight:700,color:"#fff"}}>Panel Docente</h2>
        <button onClick={reset} style={{padding:"7px 14px",borderRadius:"8px",border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#f87171",fontFamily:"inherit",fontSize:"12px",cursor:"pointer"}}>
          Restaurar original
        </button>
      </div>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"20px"}}>Edita, agrega o elimina casos clinicos. Los cambios se guardan automaticamente.</p>
      <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"24px"}}>
        {db.areas.map(a => (
          <button key={a.id} onClick={()=>setTab(a.id)} style={{padding:"7px 16px",borderRadius:"20px",border:`1px solid ${tab===a.id?a.color+"80":"rgba(255,255,255,0.1)"}`,background:tab===a.id?a.color+"20":"transparent",color:tab===a.id?"#e8eaf0":"#6a8faa",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",fontWeight:tab===a.id?600:400}}>
            {a.icon} {a.nombre}
          </button>
        ))}
      </div>
      {area && (
        <>
          <button onClick={addCase} style={{marginBottom:"16px",padding:"8px 16px",borderRadius:"10px",border:"1px solid rgba(99,179,237,0.35)",background:"transparent",color:"#63b3ed",fontFamily:"inherit",fontSize:"13px",cursor:"pointer"}}>
            + Agregar caso clinico
          </button>
          {area.casos.length === 0 && <div style={{textAlign:"center",padding:"40px",color:"#4a7fa5"}}>No hay casos. Agrega el primero.</div>}
          {area.casos.map(c => (
            <div key={c.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"16px 18px",marginBottom:"10px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:open===c.id?"12px":"0"}}>
                <div style={{fontSize:"14px",fontWeight:600,color:"#c8d8e8"}}>{c.titulo||"Sin titulo"}</div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button onClick={()=>setOpen(open===c.id?null:c.id)} style={{padding:"4px 10px",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#6a8faa",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>
                    {open===c.id?"Contraer":"Editar"}
                  </button>
                  <button onClick={()=>delCase(c.id)} style={{padding:"4px 10px",borderRadius:"6px",border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#f87171",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>
                    Eliminar
                  </button>
                </div>
              </div>
              {open===c.id && (
                <>
                  <label style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#4a7fa5",display:"block",marginBottom:"5px"}}>Titulo</label>
                  <input style={inp} value={c.titulo} onChange={e=>updCase(c.id,"titulo",e.target.value)} placeholder="Titulo del caso"/>
                  <label style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#4a7fa5",display:"block",marginBottom:"5px"}}>Descripcion del caso</label>
                  <textarea style={{...inp,resize:"vertical",minHeight:"70px",lineHeight:1.5}} value={c.caso} onChange={e=>updCase(c.id,"caso",e.target.value)} placeholder="Describe el caso clinico..."/>
                  <label style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#4a7fa5",display:"block",marginBottom:"8px"}}>Preguntas y respuestas</label>
                  {c.preguntas.map((q,qi) => (
                    <div key={qi} style={{background:"rgba(255,255,255,0.03)",borderRadius:"10px",padding:"12px",marginBottom:"8px",display:"flex",gap:"8px"}}>
                      <div style={{fontSize:"11px",color:"#4a7fa5",fontWeight:700,paddingTop:"8px",flexShrink:0,width:"20px"}}>P{qi+1}</div>
                      <div style={{flex:1}}>
                        <input style={{...inp,marginBottom:"6px"}} value={q.texto} onChange={e=>updQ(c.id,qi,"texto",e.target.value)} placeholder="Pregunta..."/>
                        <textarea style={{...inp,resize:"vertical",minHeight:"55px",lineHeight:1.5,marginBottom:"6px"}} value={q.respuesta} onChange={e=>updQ(c.id,qi,"respuesta",e.target.value)} placeholder="Respuesta esperada..."/>
                        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                          <label style={{fontSize:"12px",color:"#6a8faa",display:"flex",alignItems:"center",gap:"6px"}}>
                            Puntaje:
                            <input type="number" min="1" max="10" value={q.puntaje} onChange={e=>updQ(c.id,qi,"puntaje",e.target.value)} style={{...inp,width:"55px",marginBottom:0,textAlign:"center",padding:"6px"}}/>
                          </label>
                          {c.preguntas.length>1 && <button onClick={()=>delQ(c.id,qi)} style={{padding:"5px 10px",borderRadius:"6px",border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#f87171",fontFamily:"inherit",fontSize:"11px",cursor:"pointer"}}>Eliminar</button>}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={()=>addQ(c.id)} style={{padding:"7px 14px",borderRadius:"8px",border:"1px solid rgba(99,179,237,0.3)",background:"transparent",color:"#63b3ed",fontFamily:"inherit",fontSize:"12px",cursor:"pointer"}}>
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

function HistoryV({history}) {
  if (history.length === 0) return (
    <div style={{maxWidth:"700px",margin:"0 auto",padding:"40px 24px"}}>
      <h2 style={{fontSize:"28px",fontWeight:700,color:"#fff",marginBottom:"28px"}}>Historial</h2>
      <div style={{textAlign:"center",padding:"60px",color:"#4a7fa5"}}>
        <div style={{fontSize:"48px",marginBottom:"16px"}}>📊</div>
        No hay evaluaciones registradas aun.
      </div>
    </div>
  );
  return (
    <div style={{maxWidth:"700px",margin:"0 auto",padding:"40px 24px"}}>
      <h2 style={{fontSize:"28px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>Historial</h2>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"20px"}}>{history.length} evaluacion(es)</p>
      {history.map((h,i) => {
        const pct = Math.round((h.puntaje/h.max)*100);
        const color = pct>=80?"#10b981":pct>=60?"#f59e0b":"#ef4444";
        return (
          <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"16px 20px",marginBottom:"10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:600,color:"#c8d8e8",marginBottom:"4px"}}>{h.caso}</div>
              <div style={{fontSize:"12px",color:"#4a7fa5"}}>{h.area} · {new Date(h.date).toLocaleDateString("es-BO",{day:"2-digit",month:"short",year:"numeric"})}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"20px",fontWeight:700,color}}>{h.puntaje}/{h.max}</div>
              <div style={{fontSize:"11px",color:"#4a7fa5"}}>{pct}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
