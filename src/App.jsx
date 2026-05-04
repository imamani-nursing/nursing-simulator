import { useState, useEffect, useRef } from "react";

const INITIAL_DB = {
  áreas: [
    {
      id: "pediatria", nombre: "Pediatría", icono: "ðŸ'¶", color: "#1A5276",
      casos: [
        {
          id: "p1", título: "Neumonía Infantil",
          caso: "Niño de 2 años con fiebre de 39.2°C, tos productiva de 3 días y dificultad respiratoria progresiva. FR: 52 rpm, FC: 128 lpm, SatOâ‚‚: 91%, tiraje intercostal positivo y crepitantes en base pulmonar derecha.",
          preguntas: [
            { texto: "Â¿CuÃ¡l es el diagnÃ³stico probable segÃºn criterios AIEPI?", respuesta: "NeumonÃa grave segÃºn criterios AIEPI por FR elevada, fiebre y dificultad respiratoria.", puntaje: 3 },
            { texto: "¿Qué signo clínico indica mayor gravedad?", respuesta: "El tiraje intercostal positivo con SatOâ‚‚ de 91% indica compromiso respiratorio grave con hipoxemia.", puntaje: 3 },
            { texto: "¿Cuál es la primera intervención de enfermería prioritaria?", respuesta: "Administrar oxÃgeno para mantener SatOâ‚‚ mayor a 95%, controlar signos vitales y referir urgente según protocolo AIEPI.", puntaje: 4 }
          ]
        },
        {
          id: "p2", titulo: "Deshidratación por Diarrea",
          caso: "Lactante de 8 meses con diarrea líquida desde hace 48 horas, 8 deposiciones en el día. Ojos hundidos, llanto sin lágrimas, mucosas secas, fontanela deprimida, signo del pliegue positivo. T°: 37.8Â°C, FC: 140 lpm.",
          preguntas: [
            { texto: "¿Cuál es el grado de deshidratación según clasificación OMS?", respuesta: "Deshidratación moderada con al menos 2 signos como ojos hundidos, llanto sin lágrimas y pliegue positivo.", puntaje: 3 },
            { texto: "¿Cuáles son los dos signos clínicos más relevantes?", respuesta: "Ojos hundidos y signo del pliegue cutáneo positivo que tarda más de 2 segundos en volver.", puntaje: 3 },
            { texto: "¿Cuál es el tratamiento de rehidratación indicado?", respuesta: "Plan B: Sales de Rehidratación Oral 75 ml por kilo en 4 horas con control estricto cada 30 minutos.", puntaje: 4 }
          ]
        },
        {
          id: "p3", titulo: "Crisis Convulsiva Febrero",
          caso: "Niño de 3 años con antecedente de convulsión febril. Episodio tónico-clónico generalizado de 2 minutos asociado a fiebre de 39.5°C. Al llegar: somnoliento pero reactivo. FC: 132 lpm, T°: 39.5°C.",
          preguntas: [
            { texto: "¿Cómo se clasifica este episodio convulsivo?", respuesta: "Convulsión febril simple: duración menor a 15 minutos, generalizada, sin focalidad neurológica y única en 24 horas.", puntaje: 4 },
            { texto: "¿Cuál es la posición de seguridad inmediata?", respuesta: "Posición lateral de seguridad para evitar broncoaspiración y mantener vía área permeable.", puntaje: 3 },
            { texto: "¿Qué intervenciones realizan enfermería para controlar la fiebre?", respuesta: "Administrar paracetamol 15 mg por kilo vía rectal, baño tibio y monitorizar temperatura cada 30 minutos.", puntuación: 3 }
          ]
        }
      ]
    },
    {
      id: "gineco", nombre: "Ginecoobstetricia", icono: "ðŸ¤±", color: "#6C3483",
      casos: [
        {
          id: "g1", título: "Preeclampsia Severa",
          caso: "Gestante de 34 semanas, primigesta de 28 años. PA: 165/108 mmHg, cefalea intensa, visión borrosa, epigastralgia. Edema en miembros inferiores y cara. Proteinuria +++. FCF: 148 lpm.",
          preguntas: [
            { texto: "Â¿CuÃ¡l es el diagnÃ³stico y cÃ³mo se diferencia de la preeclampsia leve?", respuesta: "Preeclampsia severa: PA mayor o igual a 160/110 con proteinuria y sÃntomas como cefalea y alteraciones visuales.", puntaje: 3 },
            { texto: "¿Cuál es el riesgo materno-fetal más grave e inmediato?", respuesta: "Riesgo de eclampsia con convulsiones, síndrome HELLP y desprendimiento prematuro de placenta.", puntaje: 3 },
            { texto: "¿Cuáles son las intervenciones de enfermería prioritarias?", respuesta: "Control estricto de PA cada 15 minutos, canalizar vía venosa, preparar sulfato de magnesio y referencia urgente.", puntaje: 4 }
          ]
        },
        {
          id: "g2", título: "Hemorragia posparto",
          caso: "Puérpera de 25 años, 30 minutos postparto vaginal. Sangrado abundante mayor a 500 ml, útero blando y mal contraído. PA: 90/60 mmHg, FC: 118 lpm, palidez intensa, sudoración fría.",
          preguntas: [
            { texto: "Â¿CuÃ¡l es el diagnÃ³stico y su causa mÃ¡s probable?", respuesta: "Hemorragia postparto primaria por atonÃa uterina, causa mÃ¡s frecuente en el 80% de los casos.", puntaje: 3 },
            { texto: "¿Cuál es la maniobra mecánica de primera línea?", respuesta: "Masaje uterino bimanual externo con compresión firme del fondo uterino para estimular la contracción.", puntuación: 3 },
            { texto: "Â¿CuÃ¡les son las intervenciones inmediatas en orden de prioridad?", respuesta: "Masaje uterino, canalizar 2 vÃas venosas, administrar oxitocina, monitorizar signos vitales.", puntaje: 4 }
          ]
        }
      ]
    },
    {
      id: "quirurgica", nombre: "Instrumentación Quirúrgica", icono: "ðŸ ¥", color: "#1E8449",
      casos: [
        {
          id: "q1", titulo: "Conteo Incorrecto de Gasas",
          caso: "Durante cierre de laparotomía exploradora, el conteo inicial fue de 20 gasas. Al conteo final: 19 gasas. El cirujano está listo para suturar la fascia.",
          preguntas: [
            { texto: "Â¿CuÃ¡l es la acciÃ³n inmediata que debe tomar la instrumentadora?", respuesta: "Suspender inmediatamente el cierre e informar al cirujano del conteo incorrecto de forma clara y firme.", puntaje: 4 },
            { texto: "¿Qué protocolo debe activarse ante un conteo incorrecto?", respuesta: "Reconteo sistemático en campo, instrumental y residuos; solicitar radiografía intraoperatoria si no se localiza.", puntaje: 3 },
            { texto: "¿Cómo se documenta este evento en el registro quirúrgico?", respuesta: "Registrar hora de conteo, discrepancia detectada, acciones tomadas y resolución del incidente con firma del equipo.", puntaje: 3 }
          ]
        },
        {
          id: "q2", titulo: "Accidente Biológico por Pinchazo",
          caso: "Durante apendicectomía, la instrumentadora sufre pinchazo con aguja usada. Paciente con Hepatitis B y VIH desconocido. La instrumentadora no recuerda su estado de vacunación.",
          preguntas: [
            { texto: "Â¿CuÃ¡l es la primera acción inmediata tras el accidente?", respuesta: "Lavado inmediato con agua y jabón por mínimo 5 minutos, luego aplique antiséptico. No succionar con la boca.", puntuación: 4 },
            { texto: "¿Qué protocolo institucional debe activarse?", respuesta: "Notificar al jefe de servicio, acudir a urgencias y tomar muestra serológica basal del accidentado y del paciente fuente.", puntaje: 3 },
            { texto: "¿Cuáles son las acciones de seguimiento post-exposición?", respuesta: "Seguimiento serológico a 6 semanas, 3 y 6 meses; profilaxis post-exposición al VIH dentro de 2 horas e iniciar vacunación anti-Hepatitis B.", puntaje: 3 }
          ]
        }
      ]
    },
    {
      id: "materno", nombre: "Materno Infantil", ícono: "ðŸ'©â€ ðŸ'¦", color: "#B7950B",
      casos: [
        {
          id: "m1", titulo: "Técnica de Lactancia Materna",
          caso: "Madre primípara de 19 años, día 3 postparto. Dolor intenso en pezones al amamantar. El bebé succiona solo el pezón sin abarcar la areola, madre en posición encorvada con tensión en hombros.",
          preguntas: [
            { texto: "Â¿CuÃ¡l es el problema identificado en la técnica de lactancia?", respuesta: "Mala técnica de agarre: el bebé succiona solo el pezón sin incluir la areola, causando dolor y producción insuficiente.", puntuación: 3 },
            { texto: "Â¿Cómo se corrige la posición y el agarre del bebé?", respuesta: "Madre erguida con espalda apoyada, bebé alineado abdomen contra abdomen, boca amplia a generosa pezón más areola con labios evertidos.", puntaje: 4 },
            { texto: "¿Qué educación brinda enfermería sobre los beneficios de la lactancia exclusiva?", respuesta: "Protección contra infecciones, reduce alergias y obesidad, fortalece el vínculo materno-infantil y reduce el riesgo de cáncer de mama materno.", puntuación: 3 }
          ]
        },
        {
          id: "m2", título: "Asfixia Neonatal",
          caso: "Recién nacido con circular de cordón doble al cuello. Al nacer: no respira, no llora, hipotónico, coloración pálida-azulada. FC: 50 lpm. Líquido amniótico claro. Apgar 1 minuto: 1/10.",
          preguntas: [
            { texto: "¿Cuál es el diagnóstico y cómo se clasifica la severidad?", respuesta: "Asfixia neonatal severa: Apgar 1 de 10 con FC menor a 60 lpm, apnea e hipotonía generalizada.", puntaje: 4 },
            { texto: "¿Cuáles son los pasos inmediatos de reanimación neonatal avanzada?", respuesta: "Posicionar, limpiar vía aérea, estimular, iniciar ventilación con presión positiva; si FC menor a 60: masaje cardíaco e intubación con adrenalina.", puntuación: 3 },
            { texto: "¿Cuál es el criterio para iniciar masaje cardíaco externo en el neonato?", respuesta: "FC menor a 60 lpm después de 30 segundos de ventilación con presión positiva efectiva. Técnica de 2 pulgares, relación 3:1.", puntuación: 3 }
          ]
        }
      ]
    },
    {
      id: "primeros", nombre: "Primeros Auxilios", icono: "ðŸš'", color: "#922B21",
      casos: [
        {
          id: "a1", título: "Paro Cardiorrespiratorio",
          caso: "Hombre de 60 años colapsa en la vía pública. Inconsciente, sin respuesta, sin respiración normal (boqueos agónicos). No se palpa pulso carotídeo en 10 segundos. No hay DEA visible.",
          preguntas: [
            { texto: "¿Cuáles son los criterios para confirmar el PCR y activar la cadena de supervivencia?", respuesta: "Inconsciencia, ausencia de respiración normal y ausencia de pulso en 10 segundos. Activar SEM, iniciar RCP y conseguir DEA.", puntaje: 3 },
            { texto: "¿Cuál es la secuencia correcta de RCP básica del adulto según AHA 2020?", respuesta: "Secuencia CAB: 30 compresiones de 5-6 cm a 100-120 por minuto más 2 ventilaciones, relación 30:2 minimizando interrupciones.", puntuación: 4 },
            { texto: "¿Cuándo y cómo se usa el DEA si llega disponible?", respuesta: "Encender, colocar electrodos, alejarse para análisis del ritmo, aplicar descarga si indica y reanudar RCP inmediatamente sin verificar pulso.", puntuación: 3 }
          ]
        },
        {
          id: "a2", titulo: "Obstrucción de Vía Aérea",
          caso: "Adulto de 52 años en restaurante se lleva las manos al cuello, no puede hablar ni respirar, está completamente cianótico con movimientos respiratorios ineficaces y pánico visible.",
          preguntas: [
            { texto: "¿Cómo se diferencia la obstrucción completa de la incompleta?", respuesta: "Obstrucción completa: incapacidad total para hablar, toser o respirar con cianosis. Incompleta: hay tos efectiva y puede emitir sonidos.", puntaje: 3 },
            { texto: "Â¿CuÃ¡l es la maniobra de primera elección y cómo se realiza?", respuesta: "Maniobra de Heimlich: puño entre ombligo y apéndice xifoides, compresiones bruscas hacia adentro y arriba hasta expulsar el cuerpo extraño.", puntaje: 4 },
            { texto: "¿Qué hacer si el paciente pierde la conciencia durante el atragantamiento?", respuesta: "Recostarlo, llamar al SEM, iniciar RCP con compresiones torácicas y revisar boca antes de cada ventilación para extraer el cuerpo extraño visible.", puntuación: 3 }
          ]
        }
      ]
    }
  ]
};

const ADMIN_PIN = "1234";

función hablar(texto) {
  si (!window.speechSynthesis) regresar;
  ventana.síntesisDeVoz.cancelar();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES"; tasa u = 0,92; tono u = 1;
  ventana.síntesisDeVoz.hablar(u);
}

función asíncrona callAI(prompt) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    método: "POST",
    encabezados: { "Content-Type": "application/json" },
    cuerpo: JSON.stringify({ modelo: "claude-sonnet-4-20250514", max_tokens: 1000, mensajes: [{ rol: "usuario", contenido: mensaje }] })
  });
  const d = await r.json();
  return d.content.map(i => i.text || "").join("").replace(/json|/g, "").trim();
}

función asíncrona evalAnswer(pregunta, respuestaEsperada, respuestaEstudiante) {
  intentar {
    const txt = await callAI(`Eres evaluador de enfermería. Evalúa si la respuesta del estudiante es correcta.
PREGUNTA: ${pregunta}
RESPUESTA ESPERADA: ${respuestaEsperada}
RESPUESTA DEL ESTUDIANTE: ${respuestaEstudiante}
Responde SOLO en JSON sin comillas graves: {"correcto": true/false, "mensaje": "frase corta para voz 1-2 oraciones", "retroalimentacion": "explicación breve máximo 2 líneas"}
Si menciona conceptos clave aunque no use palabras exactas, se considerará correcto.`);
    devolver JSON.parse(txt);
  } catch { return { correcto: false, mensaje: "No pude evaluar. Inténtalo de nuevo.", retroalimentacion: "" }; }
}

función asíncrona consultaGeneral(sintomas) {
  intentar {
    const txt = await callAI(`Eres asistente de orientación en salud. Analiza los síntomas y la orientación básica.
SÃ NTOMAS: ${sintomas}
Responde SOLO en JSON sin comillas graves: {"condicion": "posible condición", "descripcion": "descripción breve", "recomendaciones": ["rec1","rec2","rec3"], "urgencia": "baja/media/alta", "mensaje_voz": "mensaje breve 2-3 oraciones incluyendo que deben consultar a un médico"}
Siempre incluirá que esto es orientación básica y deben consultar a un profesional.`);
    devolver JSON.parse(txt);
  } catch { return { condicion: "Error de conexión", descripcion: "No se pudo procesar la consulta.", recomendaciones: ["Consulte a un médico"], urgencia: "media", mensaje_voz: "Por favor consulte a un profesional de salud." }; }
}

función asíncrona saveDB(db) { try { await window.storage.set("ndb_v2", JSON.stringify(db)); } catch {} }
función asíncrona loadDB() { try { const r = await window.storage.get("ndb_v2"); return r ? JSON.parse(r.value) : null; } catch { return null; } }
función asíncrona saveHist(h) { try { await window.storage.set("nhist_v2", JSON.stringify(h)); } catch {} }
función asíncrona loadHist() { try { const r = await window.storage.get("nhist_v2"); return r ? JSON.parse(r.value) : []; } catch { return []; } }

export default function App() {
  const [view, setView] = useState("home");
  const [db, setDB] = useState(null);
  const [historial, establecerHistorial] = usarEstado([]);
  const [toast, setToast] = useState(null);
  const [adminOk, setAdminOk] = useState(false);

  useEffect(() => { (async () => { setDB(await loadDB() || INITIAL_DB); setHistory(await loadHist()); })(); }, []);

  const updDB = async (n) => { setDB(n); await saveDB(n); };
  const addHist = async (e) => { const n = [e, ...history].slice(0, 30); setHistory(n); await saveHist(n); };
  const toast_ = (m) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  si (!db) devolver (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0f1e"}}>
      <div style={{display:"flex",gap:"8px"}}>{[0,1,2].map(i=><div key={i} style={{width:"10px",height:"10px",borderRadius:"50%",background:"#63b3ed",animation:bounce 1.2s ${i*0.2}s infinite}}/>)}</div>
      <style>{@keyframes bounce{0%,80%,100%{transform:scale(0.8);opacity:0.5}40%{transform:scale(1.2);opacity:1}}}</style>
    </div>
  );

  devolver (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0f1e 0%,#0d1a2e 60%,#0a1628 100%)",fontFamily:"'DM Sans',system-ui,sans-serif",color:"#e8eaf0"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:rgba(255,255,255,0.03)} ::-webkit-scrollbar-thumb{background:rgba(99,179,237,0.3);border-radius:3px}
        @keyframes bounce{0%,80%,100%{transform:scale(0.8);opacity:0.5}40%{transform:scale(1.2);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseMic{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes girar{a{transformar:rotar(360 grados)}}
      `}</style>

      {/* NAV */}
      <nav style={{background:"rgba(10,15,30,0.9)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(99,179,237,0.12)",padding:"0 24px",display:"flex",alignItems:"center",gap:"12px",height:"60px",position:"sticky",top:0,zIndex:100}}>
        <div style={{marginRight:"auto"}}>
          <div style={{fontFamily:"Fraunces,"serif",fontSize:"20px",fontWeight:800,color:"#63b3ed",letterSpacing:"-0.5px"}}>NursingAI</div>
          <div style={{fontSize:"10px",color:"#3a6a8a",textTransform:"uppercase",letterSpacing:"2px",marginTop:"-2px"}}>Simulador Clínico · Bolivia</div>
        </div>
        {[["home","ðŸ Inicio"],["general","ðŸ©º General"],["student","ðŸŽ“ Estudiante"],["admin", adminOk?"ðŸ”“ Docente":"ðŸ” Docente"],["history","ðŸ“Š Historial"]].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{padding:"7px 14px",borderRadius:"20px",border:1px solid ${view===v?"rgba(99,179,237,0.6)":"rgba(255,255,255,0.08)"},background:view===v?"rgba(99,179,237,0.15)":"transparent",color:view===v?"#63b3ed":"#6a8faa",fontSize:"12px",fontWeight:view===v?600:400,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",whiteSpace:"nowrap"}}>
            {l}
          </button>
        ))}
      </nav>

      {view==="home" && <HomeV setView={setView}/>}
      {view==="general" && <GeneralV/>}
      {view==="student" && <StudentV db={db} addHist={addHist}/>}
      {view==="admin" && (adminOk ? <AdminV db={db} updDB={updDB} toast={toast_}/> : <PinV onOk={()=>setAdminOk(true)}/>)}
      {view==="history" && <HistoryV history={history}/>}

      {toast && <div style={{position:"fixed",bottom:"24px",right:"24px",background:"#1a3a5c",border:"1px solid rgba(99,179,237,0.4)",borderRadius:"12px",padding:"12px 20px",fontSize:"13px",color:"#63b3ed",zIndex:999,animation:"toastIn 0.3s ease"}}>âœ“ {toast}</div>}
    </div>
  );
}

función HomeV({setView}) {
  devolver (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - 60px)",padding:"40px 24px",textAlign:"center",animation:"fadeUp 0.5s ease"}}>
      <div style={{fontSize:"56px",marginBottom:"16px"}}>ðŸ ¥</div>
      <h1 style={{fontFamily:"Fraunces,"serif",fontSize:"clamp(36px,7vw,68px)",fontWeight:800,color:"#fff",lineHeight:1.1,marginBottom:"16px"}}>
        Simulador de<br/><span style={{color:"#63b3ed"}}>Casos Clínicos</span><br/>en Enfermería
      </h1>
      <p style={{fontSize:"15px",color:"#6a8faa",maxWidth:"480px",marginBottom:"48px",lineHeight:1.7}}>
        Plataforma de aprendizaje con IA para estudiantes de enfermería y orientación básica en salud para el público general. Responde con tu voz o por escrito.
      </p>
      <div style={{display:"flex",gap:"20px",flexWrap:"wrap",justifyContent:"center",maxWidth:"680px"}}>
        {[
          {v:"general",icon:"ðŸ©º",title:"Modo General",desc:"Describe síntomas y recibe orientación básica en salud con recomendaciones y derivación médica profesional.",color:"#63b3ed"},
          {v:"student",icon:"ðŸŽ“",title:"Modo Estudiante",desc:"Practica casos clínicos reales, responde preguntas por voz y recibe evaluación inmediata con puntaje y retroalimentación.",color:"#9f7aea"}
        ].map(({v,icono,título,desc,color})=>(
          <div key={v} onClick={()=>setView(v)} style={{background:linear-gradient(135deg,${color}12,${color}06),border:1px solid ${color}30,borderRadius:"20px",padding:"36px 28px",cursor:"pointer",flex:1,minWidth:"260px",maxWidth:"300px",transition:"all 0.3s",textAlign:"left"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor=color+"70";e.currentTarget.style.boxShadow=0 20px 50px ${color}18}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=color+"30";e.currentTarget.style.boxShadow=""}}>
            <div style={{fontSize:"44px",marginBottom:"16px"}}>{icon}</div>
            <div style={{fontFamily:"Fraunces,"serif",fontSize:"24px",fontWeight:700,color:"#fff",marginBottom:"8px"}}>{título}</div>
            <div style={{fontSize:"13px",color:"#6a8faa",lineHeight:1.6}}>{desc}</div>
            <div style={{marginTop:"20px",fontSize:"13px",color,fontWeight:600}}>Ingresar â†'</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:"48px",display:"flex",gap:"32px",flexWrap:"wrap",justifyContent:"center"}}>
        {[["5","Ã reas ClÃnicas"],["50+","Casos disponibles"],["IA","Evaluación inteligente"],["ðŸŽ¤","Respuesta por voz"]].map(([n,l])=>(
          <div key={l} style={{textAlign:"center"}}>
            <div style={{fontFamily:"Fraunces,"serif",fontSize:"28px",fontWeight:800,color:"#63b3ed"}}>{n}</div>
            <div style={{fontSize:"12px",color:"#4a7fa5"}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

función useSpeechRec(onResult) {
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const alternar = () => {
    if (!("webkitSpeechRecognition" en ventana||"SpeechRecognition" en ventana)) { alert("Usa Chrome para reconocimiento de voz."); devolver; }
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    const r = new SR(); r.lang="es-ES"; r.continuous=false; r.interimResults=false;
    r.onresult=e=>onResult(e.results[0][0].transcript);
    r.onend=()=>setListening(false); r.onerror=()=>setListening(false);
    recRef.current=r; r.start(); setListening(true);
  };
  devolver [escuchando, alternar];
}

función MicBtn({listening, onToggle, disabled}) {
  devolver (
    <button onClick={onToggle} disabled={disabled} style={{width:"44px",height:"44px",borderRadius:"50%",border:2px solid ${listening?"#ef4444":"rgba(99,179,237,0.4)"},background:listening?"rgba(239,68,68,0.15)":"transparent",color:listening?"#ef4444":"#63b3ed",fontSize:"18px",cursor:disabled?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s",animation:listening?"pulseMic 1s infinite":"none"}}>
      {escuchando?"ðŸ”´":"ðŸŽ¤"}
    </button>
  );
}

función Cargador() {
  return <div style={{display:"flex",gap:"6px",justifyContent:"center",padding:"20px"}}>{[0,1,2].map(i=><div key={i} style={{width:"8px",height:"8px",borderRadius:"50%",background:i===1?"#9f7aea":"#63b3ed",animation:bounce 1.2s ${i*0.2}s infinite}}/>)}</div>;
}

función GeneralV() {
  const [text,setText]=useState("");
  const [cargando, setLoading]=useState(false);
  const [resultado,setResultado]=useState(null);
  const [listening,toggleMic]=useSpeechRec(t=>setText(p=>p?p+" "+t:t));

  const send=async()=>{
    Si (!text.trim())regresar;
    setLoading(verdadero);setResult(nulo);
    const r=await consultaGeneral(text);
    setResult(r);setLoading(false);
    hablar(r.mensaje_voz);
  };

  const urgColors={alta:"#ef4444",media:"#f59e0b",baja:"#10b981"};
  const urg=resultado?.urgencia||"baja";

  devolver (
    <div style={{maxWidth:"680px",margin:"0 auto",padding:"40px 24px",animation:"fadeUp 0.4s ease"}}>
      <h2 style={{fontFamily:"Fraunces,serif",fontSize:"32px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>Orientación en Salud</h2>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"28px"}}>Describe los síntomas que sientes o que observas. Recibirás orientación básica de enfermería.</p>

      <div style={{background:"rgba(99,179,237,0.05)",border:"1px solid rgba(99,179,237,0.18)",borderRadius:"16px",padding:"20px"}}>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Ej: Tengo fiebre de 38.5°C desde hace 2 días, dolor de cabeza intenso y no puedo comer..." style={{ancho:"100%",fondo:"transparente",border:"none",color:"#e8eaf0",fontFamily:"heredar",fontSize:"15px",resize:"none",outline:"none",minHeight:"90px",lineHeight:1.6}} />
        <div style={{display:"flex",gap:"10px",marginTop:"12px",alignItems:"center"}}>
          <MicBtn listening={listening} onToggle={toggleMic}/>
          <button onClick={send} disabled={loading||!text.trim()} style={{flex:1,padding:"12px 20px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#3b82f6,#2563eb)",color:"#fff",fontFamily:"inherit",fontSize:"14px",fontWeight:600,cursor:"pointer",opacity:loading||!text.trim()?0.5:1,transition:"all 0.2s"}}>
            {cargando?"Analizando...":"Consultar â†'"}
          </button>
        </div>
      </div>

      {cargando && <Cargador/>}

      {resultado && (
        <div style={{marginTop:"24px",background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:"16px",padding:"24px",animation:"fadeUp 0.3s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"}}>
            <span style={{background:${urgColors[urg]}20,color:urgColors[urg],border:1px solid ${urgColors[urg]}40,padding:"3px 12px",borderRadius:"20px",fontSize:"11px",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>
              {urg==="alta"?"âš Urgencia Alta":urg==="media"?"âš¡ Urgencia Media":"âœ“ Urgencia Baja"}
            </span>
          </div>
          <div style={{fontFamily:"Fraunces,"serif",fontSize:"22px",color:"#34d399",marginBottom:"8px"}}>{result.condicion}</div>
          <div style={{fontSize:"14px",color:"#8ab0c8",marginBottom:"16px",lineHeight:1.6}}>{result.descripcion}</div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:"16px"}}>
            {resultado.recomendaciones?.map((r,i)=>(
              <div key={i} style={{display:"flex",gap:"10px",padding:"8px 0",fontSize:"14px",color:"#b0c8dc",borderBottom:i<result.recomendaciones.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <span style={{color:"#34d399",flexShrink:0}}>â†'</span>{r}
              </div>
            ))}
          </div>
          <div style={{marginTop:"16px",padding:"12px",background:"rgba(234,179,8,0.08)",borderRadius:"8px",fontSize:"12px",color:"#ca8a04",borderLeft:"3px solid #ca8a04"}}>
            âš• Esta información es orientativa. Consulte siempre a un profesional de salud para diagnóstico y tratamiento.
          </div>
          <button onClick={()=>speak(result.mensaje_voz)} style={{marginTop:"14px",padding:"10px 20px",borderRadius:"10px",border:"1px solid rgba(99,179,237,0.3)",background:"transparent",color:"#63b3ed",fontFamily:"inherit",fontSize:"13px",cursor:"pointer"}}>ðŸ”Š Escuchar respuesta</button>
        </div>
      )}
    </div>
  );
}

función EstudianteV({db,addHist}) {
  const [step,setStep]=useState("area");
  const [areaId,setAreaId]=useState(nulo);
  const [caseId,setCaseId]=useState(null);
  const [qIdx,setQIdx]=useState(0);
  const [ans,setAns]=useState("");
  const [respuestas,setAnswers]=useState([]);
  const [feedback,setFeedback]=useState(null);
  const [cargando, setLoading]=useState(false);
  const [listening,toggleMic]=useSpeechRec(t=>setAns(p=>p?p+" "+t:t));

  const area=db.areas.find(a=>a.id===areaId);
  const caso=area?.casos.find(c=>c.id===caseId);
  const q=caso?.preguntas[qIdx];

  const startCase=(aid,cid)=>{
    setAreaId(aid);setCaseId(cid);setQIdx(0);setAns("");setAnswers([]);setFeedback(null);setStep("eval");
    const c=db.areas.find(a=>a.id===aid)?.casos.find(c=>c.id===cid);
    if(c) hablar("Inicio de evaluación. "+c.caso);
  };

  const submit=async()=>{
    if(!ans.trim()||!q)return;
    setLoading(verdadero);setFeedback(nulo);
    const r=await evalAnswer(q.texto,q.respuesta,ans);
    setFeedback({...r,pts:r.correcto?q.puntaje:0,max:q.puntaje});
    hablar(r.mensaje);setLoading(false);
  };

  const next=()=>{
    const newAnswers=[...respuestas,{...feedback,pregunta:q.texto,respuesta:ans}];
    establecerRespuestas(nuevasRespuestas);
    if(qIdx+1>=caso.preguntas.longitud){
      const total = newAnswers.reduce((s, a) => s + a.pts, 0);
      const max=newAnswers.reduce((s,a)=>s+a.max,0);
      addHist({date:new Date().toISOString(),area:area.nombre,caso:caso.titulo,puntaje:total,max});
      setAnswers(newAnswers);setStep("puntuación");
    } demás {
      setQIdx(qIdx+1);setFeedback(null);setAns("");
      hablar(caso.preguntas[qIdx+1].texto);
    }
  };

  si(paso==="área") devolver (
    <div style={{maxWidth:"800px",margin:"0 auto",padding:"40px 24px",animation:"fadeUp 0.4s ease"}}>
      <h2 style={{fontFamily:"Fraunces,serif",fontSize:"32px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>Modo Estudiante</h2>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"28px"}}>Selecciona el área clínica que deseas evaluar</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:"14px"}}>
        {db.areas.map(a=>(
          <div key={a.id} onClick={()=>{setAreaId(a.id);setStep("case");}} style={{background:${a.color}12,border:1px solid ${a.color}35,borderRadius:"16px",padding:"24px 16px",cursor:"pointer",textAlign:"center",transition:"all 0.25s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor=a.color+"80";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=a.color+"35";}}>
            <div style={{fontSize:"36px",marginBottom:"10px"}}>{a.icon}</div>
            <div style={{fontSize:"13px",fontWeight:600,color:"#c8d8e8",marginBottom:"4px"}}>{a.nombre}</div>
            <div style={{fontSize:"11px",color:"#4a7fa5"}}>{a.casos.length} casos</div>
          </div>
        ))}
      </div>
    </div>
  );

  si(paso==="caso") devolver (
    <div style={{maxWidth:"700px",margin:"0 auto",padding:"40px 24px",animation:"fadeUp 0.4s ease"}}>
      <button onClick={()=>setStep("area")} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.12)",color:"#6a8faa",borderRadius:"8px",padding:"7px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:"13px",marginBottom:"24px"}}>â† Volver</button>
      <h2 style={{fontFamily:"Fraunces,"serif",fontSize:"28px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>{area?.nombre}</h2>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"24px"}}>Selecciona un caso clínico para iniciar la evaluación</p>
      {area?.casos.length===0&&<div style={{textAlign:"center",padding:"48px",color:"#4a7fa5"}}>ðŸ“‚ No hay casos en esta área. Agrégalos desde el panel Docente.</div>}
      {área?.casos.map(c=>{
        const total=c.preguntas.reduce((s,q)=>s+q.puntaje,0);
        devolver(
          <div key={c.id} onClick={()=>startCase(area.id,c.id)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"18px 22px",marginBottom:"10px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(99,179,237,0.08)";e.currentTarget.style.borderColor="rgba(99,179,237,0.3)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
            <div>
              <div style={{fontSize:"14px",fontWeight:600,color:"#c8d8e8",marginBottom:"3px"}}>{c.titulo}</div>
              <div style={{fontSize:"12px",color:"#4a7fa5"}}>{c.preguntas.length} preguntas· {total} puntos totales</div>
            </div>
            <span style={{color:"#4a7fa5",fontSize:"20px"}}>â€º</span>
          </div>
        );
      })}
    </div>
  );

  si(paso==="eval"&&caso) {
    const pct=caso.preguntas.longitud>0?(qIdx/caso.preguntas.longitud)*100:0;
    devolver(
      <div style={{maxWidth:"720px",margin:"0 auto",padding:"40px 24px",animation:"fadeUp 0.4s ease"}}>
        <div style={{background:"rgba(99,179,237,0.05)",border:"1px solid rgba(99,179,237,0.15)",borderRadius:"16px",padding:"24px",marginBottom:"24px"}}>
          <div style={{fontFamily:"Fraunces,"serif",fontSize:"22px",color:"#63b3ed",marginBottom:"10px"}}>{caso.titulo}</div>
          <div style={{fontSize:"14px",color:"#8ab0c8",lineHeight:1.7,fontStyle:"italic"}}>{caso.caso}</div>
          <button onClick={()=>speak(caso.caso)} style={{marginTop:"12px",background:"transparent",border:"1px solid rgba(99,179,237,0.25)",color:"#63b3ed",borderRadius:"8px",padding:"6px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:"12px"}}>ðŸ”Š Escuchar caso</button>
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
          <div style={{fontSize:"12px",color:"#ca8a04",marginBottom:"20px"}}>Valor: {q?.puntaje} puntos</div>
          <div style={{display:"flex",gap:"10px",alignItems:"flex-start",marginBottom:"12px"}}>
            <textarea value={ans} onChange={e=>setAns(e.target.value)} disabled={!!feedback} placeholder="Escribe tu respuesta o usa el micrófono..." style={{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"12px",padding:"14px",color:"#e8eaf0",fontFamily:"inherit",fontSize:"14px",resize:"none",outline:"none",minHeight:"90px",lineHeight:1.6}}/>
            <MicBtn listening={listening} onToggle={toggleMic} disabled={!!feedback}/>
          </div>
          {!comentario&&(
            <button onClick={submit} disabled={loading||!ans.trim()} style={{width:"100%",padding:"12px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#9f7aea,#7c3aed)",color:"#fff",fontFamily:"inherit",fontSize:"14px",fontWeight:600,cursor:"pointer",opacity:loading||!ans.trim()?0.4:1,transition:"all 0.2s"}}>
              {cargando?"Evaluando con IA...":"Enviar respuesta â†'"}
            </button>
          )}
          {cargando&&<Cargador/>}
          {comentario&&(
            <div style={{background:feedback.correcto?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.08)",border:1px solid ${feedback.correcto?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.25)"},borderRadius:"12px",padding:"16px",marginTop:"14px",animation:"fadeUp 0.3s ease"}}>
              <div style={{fontSize:"16px",fontWeight:700,color:feedback.correcto?"#34d399":"#f87171",marginBottom:"6px"}}>
                {feedback.correcto?"âœ“ Â¡Correcto!":"âœ— Incorrecto"} — {feedback.pts}/{feedback.max} pts
              </div>
              <div style={{fontSize:"13px",color:"#8ab0c8",lineHeight:1.5,marginBottom:"14px"}}>{feedback.retroalimentacion}</div>
              <button onClick={next} style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",background:feedback.correcto?"linear-gradient(135deg,#10b981,#059669)":"linear-gradient(135deg,#6366f1,#4f46e5)",color:"#fff",fontFamily:"inherit",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>
                {qIdx+1>=caso.preguntas.length?"Ver resultados â†'":"Siguiente pregunta â†'"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  si(paso==="puntuación") {
    const total=answers.reduce((s,a)=>s+a.pts,0);
    const max=answers.reduce((s,a)=>s+a.max,0);
    const pct=max>0?Math.round((total/max)*100):0;
    const color=pct>=80?"#10b981":pct>=60?"#f59e0b":"#ef4444";
    const grade=pct>=90?"Excelente ðŸ †":pct>=80?"Muy Bien â ":pct>=60?"Aprobado âœ“":"Necesita mejorar ðŸ“š";
    devolver(
      <div style={{maxWidth:"580px",margin:"0 auto",padding:"40px 24px",textAlign:"center",animation:"fadeUp 0.5s ease"}}>
        <h2 style={{fontFamily:"Fraunces,serif",fontSize:"26px",color:"#fff",marginBottom:"4px"}}>{caso?.titulo}</h2>
        <p style={{color:"#4a7fa5",fontSize:"13px",marginBottom:"32px"}}>{area?.nombre}</p>
        <div style={{width:"160px",height:"160px",borderRadius:"50%",margin:"0 auto 24px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:conic-gradient(${color} ${pct*3.6}deg, rgba(255,255,255,0.06) 0),boxShadow:0 0 40px ${color}30}}>
          <div style={{width:"130px",height:"130px",borderRadius:"50%",background:"#0d1a2e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontFamily:"Fraunces,"serif",fontSize:"44px",fontWeight:800,color:"#fff",lineHeight:1}}>{total}</div>
            <div style={{fontSize:"13px",color:"#4a7fa5"}}>de {max} pts</div>
          </div>
        </div>
        <div style={{fontFamily:"Fraunces,"serif",fontSize:"26px",fontWeight:700,"color",marginBottom:"8px"}}>{grade}</div>
        <div style={{fontSize:"14px",color:"#6a8faa",marginBottom:"32px"}}>{pct}% de respuestas correctas</div>
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"24px",marginBottom:"24px",textAlign:"left"}}>
          <div style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#4a7fa5",marginBottom:"16px"}}>Detalle por pregunta</div>
          {respuestas.map((a,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<answers.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
              <div style={{fontSize:"13px",color:"#8ab0c8",flex:1,marginRight:"12px",lineHeight:1.4}}>{a.pregunta}</div>
              <div style={{fontWeight:700,fontSize:"14px",color:a.pts>0?"#34d399":"#f87171",flexShrink:0}}>{a.pts}/{a.max}</div>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0 0",borderTop:"2px solid rgba(255,255,255,0.1)",marginTop:"8px"}}>
            <div style={{fontWeight:700,color:"#c8d8e8"}}>TOTAL</div>
            <div style={{fontFamily:"Fraunces,"serif",fontSize:"20px",fontWeight:800,"color}}>{total}/{max}</div>
          </div>
        </div>
        <button onClick={()=>setStep("case")} style={{padding:"14px 36px",borderRadius:"30px",border:"none",background:"linear-gradient(135deg,#63b3ed,#3b82f6)",color:"#fff",fontFamily:"inherit",fontSize:"15px",fontWeight:700,cursor:"pointer",marginBottom:"10px",display:"block",width:"100%"}}>Evaluar otro caso</button>
        <button onClick={()=>setStep("area")} style={{padding:"10px 28px",borderRadius:"30px",border:"1px solid rgba(99,179,237,0.3)",background:"transparent",color:"#63b3ed",fontFamily:"inherit",fontSize:"14px",cursor:"pointer",width:"100%"}}>Cambiar área</button>
      </div>
    );
  }
  devolver nulo;
}

función PinV({onOk}) {
  const [pin,setPin]=useState(""); const [err,setErr]=useState(false);
  const check=()=>{if(pin===ADMIN_PIN){onOk();}else{setErr(true);setPin("");}};
  devolver(
    <div style={{maxWidth:"340px",margin:"0 auto",padding:"80px 24px",textAlign:"center",animation:"fadeUp 0.4s ease"}}>
      <div style={{fontSize:"52px",marginBottom:"16px"}}>ðŸ” </div>
      <div style={{fontFamily:"Fraunces,serif",fontSize:"26px",color:"#fff",marginBottom:"6px"}}>Panel Docente</div>
      <div style={{fontSize:"14px",color:"#6a8faa",marginBottom:"32px"}}>Ingresa tu PIN para administrar la base de datos de evaluación</div>
      <input type="password" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()} maxLength={6} placeholder="â€•â€•â€•â€¢" style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"12px",padding:"16px",color:"#e8eaf0",fontSize:"22px",textAlign:"center",letterSpacing:"8px",outline:"none",fontFamily:"inherit",marginBottom:"10px"}}/>
      {err&&<div style={{color:"#f87171",fontSize:"13px",marginBottom:"10px"}}>PIN incorrecto. Inténtalo de nuevo.</div>}
      <button onClick={check} style={{width:"100%",padding:"14px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#3b82f6,#2563eb)",color:"#fff",fontSize:"15px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Acceder â†'</button>
      <div style={{marginTop:"16px",fontSize:"11px",color:"#3a5a7a"}}>PIN por defecto: 1234</div>
    </div>
  );
}

función AdminV({db,updDB,toast}) {
  const [tab,setTab]=useState(db.areas[0]?.id||"");
  const [abierto,setOpen]=useState(nulo);
  const area=db.areas.find(a=>a.id===tab);

  const updCase=(cid,field,val)=>updDB({...db,areas:db.areas.map(a=>a.id!==tab?a:{...a,casos:a.casos.map(c=>c.id!==cid?c:{...c,[field]:val})})});
  const updQ=(cid,qi,field,val)=>updDB({...db,areas:db.areas.map(a=>a.id!==tab?a:{...a,casos:a.casos.map(c=>{if(c.id!==cid)return c;const qs=[...c.preguntas];qs[qi]={...qs[qi],[field]:field==="puntaje"?parseInt(val)||0:val};return{...c,preguntas:qs};})})});
  const addQ=(cid)=>updDB({...db,areas:db.areas.map(a=>a.id!==tab?a:{...a,casos:a.casos.map(c=>c.id!==cid?c:{...c,preguntas:[...c.preguntas,{texto:"",respuesta:"",puntaje:3}]})})});
  const delQ=(cid,qi)=>updDB({...db,areas:db.areas.map(a=>a.id!==tab?a:{...a,casos:a.casos.map(c=>c.id!==cid?c:{...c,preguntas:c.preguntas.filter((_,i)=>i!==qi)})})});
  const addCase=()=>{const id="c"+Date.now();updDB({...db,areas:db.areas.map(a=>a.id!==tab?a:{...a,casos:[...a.casos,{id,titulo:"Nuevo caso clínico",caso:"",preguntas:[{texto:"",respuesta:"",puntaje:3}]}]})});setOpen(id);toast("Caso agregado");};
  const delCase=(cid)=>{if(!confirm("¿Eliminar este caso?"))return;updDB({...db,areas:db.areas.map(a=>a.id!==tab?a:{...a,casos:a.casos.filter(c=>c.id!==cid)})});toast("Caso eliminado");};
  const reset=()=>{if(!confirm("¿Restaurar la base de datos original? Se perderán todos los cambios."))return;updDB(INITIAL_DB);toast("Base de datos restaurada");};

  const inp={width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",padding:"11px 14px",color:"#e8eaf0",fontFamily:"inherit",fontSize:"14px",outline:"none",marginBottom:"12px"};

  devolver(
    <div style={{maxWidth:"860px",margin:"0 auto",padding:"40px 24px",animation:"fadeUp 0.4s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"6px"}}>
        <h2 style={{fontFamily:"Fraunces,serif",fontSize:"32px",fontWeight:700,color:"#fff"}}>Panel Docente</h2>
        <button onClick={reset} style={{padding:"8px 16px",borderRadius:"8px",border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#f87171",fontFamily:"inherit",fontSize:"12px",cursor:"pointer"}}>†º Restaurar original</button>
      </div>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"24px"}}>Edita, agrega o elimina casos clínicos. Los cambios se guardan automáticamente en la nube.</p>
      <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"28px"}}>
        {db.areas.map(a=>(
          <button key={a.id} onClick={()=>setTab(a.id)} style={{padding:"8px 18px",borderRadius:"20px",border:1px solid ${tab===a.id?a.color+"80":"rgba(255,255,255,0.1)"},background:tab===a.id?a.color+"20":"transparent",color:tab===a.id?"#e8eaf0":"#6a8faa",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",fontWeight:tab===a.id?600:400,transition:"all 0.2s"}}>
            {a.icon} {a.nombre}
          </button>
        ))}
      </div>
      {área&&(
        <>
          <button onClick={addCase} style={{marginBottom:"20px",padding:"9px 18px",borderRadius:"10px",border:"1px solid rgba(99,179,237,0.35)",background:"transparent",color:"#63b3ed",fontFamily:"inherit",fontSize:"13px",cursor:"pointer"}}>+ Agregar caso clínico</button>
          {area.casos.length===0&&<div style={{textAlign:"center",padding:"48px",color:"#4a7fa5"}}>ðŸ“‚ No hay casos. Agrega el primero.</div>}
          {área.casos.map(c=>(
            <div key={c.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"18px 20px",marginBottom:"12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:open===c.id?"14px":"0"}}>
                <div style={{fontSize:"14px",fontWeight:600,color:"#c8d8e8"}}>ðŸ“‹ {c.titulo||"Sin título"}</div>
                <div style={{display:"flex",gap:"8px"}}>
                  <button onClick={()=>setOpen(open===c.id?null:c.id)} style={{padding:"5px 12px",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#6a8faa",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>
                    {open===c.id?"Contraer â–²":"Editar â–¼"}
                  </button>
                  <button onClick={()=>delCase(c.id)} style={{padding:"5px 12px",borderRadius:"6px",border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#f87171",fontSize:"12px",cursor:"pointer",fontFamily:"inherit"}}>Eliminar</button>
                </div>
              </div>
              {open===c.id&&(
                <>
                  <label style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#4a7fa5",display:"block",marginBottom:"6px"}}>Título del caso</label>
                  <input style={inp} value={c.titulo} onChange={e=>updCase(c.id,"titulo",e.target.value)} placeholder="Ej: Neumonía Infantil"/>
                  <label style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#4a7fa5",display:"block",marginBottom:"6px"}}>DescripciÃ³n clÃnica del caso</label>
                  <textarea style={{...inp,resize:"vertical",minHeight:"80px",lineHeight:1.6,marginBottom:"16px"}} value={c.caso} onChange={e=>updCase(c.id,"caso",e.target.value)} placeholder="Describe el caso con signos vitales, síntomas y contexto clínico..."/>
                  <label style={{fontSize:"11px",textTransform:"uppercase",letterSpacing:"1.5px",color:"#4a7fa5",display:"block",marginBottom:"10px"}}>Preguntas y respuestas esperadas</label>
                  {c.preguntas.map((q,qi)=>(
                    <div key={qi} style={{background:"rgba(255,255,255,0.03)",borderRadius:"10px",padding:"14px",marginBottom:"10px",display:"flex",gap:"10px"}}>
                      <div style={{fontSize:"11px",color:"#4a7fa5",fontWeight:700,paddingTop:"10px",flexShrink:0,width:"22px"}}>P{qi+1}</div>
                      <div style={{flex:1}}>
                        <input style={{...inp,marginBottom:"8px"}} value={q.texto} onChange={e=>updQ(c.id,qi,"texto",e.target.value)} placeholder="Pregunta de evaluación..."/>
                        <textarea style={{...inp,resize:"vertical",minHeight:"60px",lineHeight:1.5,marginBottom:"8px"}} value={q.respuesta} onChange={e=>updQ(c.id,qi,"respuesta",e.target.value)} placeholder="Respuesta esperada (la IA la usará para evaluar al estudiante)"/>
                        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                          <label style={{fontSize:"12px",color:"#6a8faa",display:"flex",alignItems:"center",gap:"8px"}}>
                            Puntaje:
                            <input type="number" min="1" max="10" value={q.puntaje} onChange={e=>updQ(c.id,qi,"puntaje",e.target.value)} style={{...inp,width:"60px",marginBottom:0,textAlign:"center",padding:"8px"}}/>
                          </label>
                          {c.preguntas.length>1&&<button onClick={()=>delQ(c.id,qi)} style={{padding:"6px 12px",borderRadius:"6px",border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#f87171",fontFamily:"inherit",fontSize:"11px",cursor:"pointer"}}>Eliminar pregunta</button>}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={()=>addQ(c.id)} style={{padding:"8px 16px",borderRadius:"8px",border:"1px solid rgba(99,179,237,0.3)",background:"transparent",color:"#63b3ed",fontFamily:"inherit",fontSize:"12px",cursor:"pointer"}}>+ Agregar pregunta</button>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

función HistoryV({history}) {
  si(history.length===0) devolver(
    <div style={{maxWidth:"700px",margin:"0 auto",padding:"40px 24px"}}>
      <h2 style={{fontFamily:"Fraunces,serif",fontSize:"32px",fontWeight:700,color:"#fff",marginBottom:"32px"}}>Histórico</h2>
      <div style={{textAlign:"center",padding:"60px",color:"#4a7fa5"}}>
        <div style={{fontSize:"48px",marginBottom:"16px"}}>ðŸ“Š</div>
        <div>No hay evaluaciones registradas aún.<br/>Completa una evaluación para verla aquí.</div>
      </div>
    </div>
  );
  devolver(
    <div style={{maxWidth:"700px",margin:"0 auto",padding:"40px 24px",animation:"fadeUp 0.4s ease"}}>
      <h2 style={{fontFamily:"Fraunces,serif",fontSize:"32px",fontWeight:700,color:"#fff",marginBottom:"6px"}}>Histórico</h2>
      <p style={{color:"#6a8faa",fontSize:"13px",marginBottom:"24px"}}>{history.length} evaluación(es) registrada(s)</p>
      {historial.mapa((h,i)=>{
        const pct=Math.round((h.puntaje/h.max)*100);
        const color=pct>=80?"#10b981":pct>=60?"#f59e0b":"#ef4444";
        devolver(
          <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"16px 22px",marginBottom:"10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:600,color:"#c8d8e8",marginBottom:"4px"}}>{h.caso}</div>
              <div style={{fontSize:"12px",color:"#4a7fa5"}}>{h.area} · {new Date(h.date).toLocaleDateString("es-BO",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"Fraunces,"serif",fontSize:"22px",fontWeight:700,"color}}>{h.puntaje}/{h.max}</div>
              <div style={{fontSize:"11px",color:"#4a7fa5"}}>{pct}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
