function base(color1, color2, title, body) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:40px;color:#111;line-height:1.75;font-size:13px}
  h1{font-size:19px;text-align:center;color:${color1};border-bottom:2px solid ${color1};padding-bottom:14px;margin-bottom:28px}
  h2{font-size:12px;color:${color1};margin:22px 0 8px;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
  .campo{background:${color2};border-left:3px solid ${color1};padding:8px 14px;margin:5px 0}
  p,li{font-size:13px;margin:6px 0} ul{padding-left:22px}
  .firma-bloque{display:flex;gap:80px;margin-top:70px}
  .firma-linea{border-top:1px solid #333;width:200px;padding-top:6px;font-size:11px;color:#555;text-align:center;line-height:1.8}
  .legal{font-size:10px;color:#aaa;margin-top:40px;border-top:1px solid #eee;padding-top:12px;text-align:center}
  @media print{body{margin:0;padding:20px}}
</style>
</head>
<body>
${body}
<script>window.onload=function(){window.print()}<\/script>
</body></html>`
}

export function generarAutorizacion(p) {
  const body = `
  <h1>AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES</h1>
  <h2>Datos del/la Paciente</h2>
  <div class="campo"><strong>Nombre completo:</strong> ${p.nombre}</div>
  <div class="campo"><strong>DNI / NIE:</strong> ${p.dni}</div>
  <div class="campo"><strong>Fecha de nacimiento:</strong> ${p.fechaNacimiento}</div>
  <div class="campo"><strong>Teléfono:</strong> ${p.telefono}</div>
  <div class="campo"><strong>Email:</strong> ${p.email}</div>
  <div class="campo"><strong>Dirección:</strong> ${p.direccion || '—'}</div>

  <h2>Responsable del Tratamiento</h2>
  <p><strong>Profesional:</strong> Jaime — PsicoJaime, Consulta de Psicología Online<br>
  <strong>Número de colegiado:</strong> ______________________________<br>
  <strong>Email profesional:</strong> ______________________________<br>
  <strong>Teléfono profesional:</strong> ______________________________</p>

  <h2>Finalidad del Tratamiento</h2>
  <p>Los datos personales del/la paciente serán tratados exclusivamente para:</p>
  <ul>
    <li>Prestar servicios de atención psicológica individual online.</li>
    <li>Elaborar y mantener la historia clínica según la Ley 41/2002.</li>
    <li>Gestionar la relación terapéutica y el seguimiento clínico.</li>
    <li>Gestionar la facturación y cobros de los servicios prestados.</li>
    <li>Enviar recordatorios de citas y comunicaciones relativas a las sesiones.</li>
  </ul>

  <h2>Categoría de Datos</h2>
  <p>Se tratarán datos de <strong>categoría especial</strong> (datos de salud) conforme al Art. 9.2.h del RGPD, bajo secreto profesional y las normas deontológicas del Consejo General de la Psicología de España.</p>

  <h2>Base Jurídica</h2>
  <p>Consentimiento explícito del/la paciente (Art. 6.1.a RGPD) y cumplimiento de obligaciones legales en el ámbito sanitario (Art. 9.2.h RGPD).</p>

  <h2>Cesión de Datos</h2>
  <p>Los datos <strong>no serán cedidos a terceros</strong> salvo obligación legal. Las plataformas de videollamada utilizadas para las sesiones online cumplen con el RGPD y disponen de los acuerdos de tratamiento correspondientes.</p>

  <h2>Conservación de Datos</h2>
  <p>Los datos se conservarán mientras dure la relación terapéutica y posteriormente el tiempo necesario para cumplir con las obligaciones legales aplicables en el ámbito sanitario.</p>

  <h2>Derechos del/la Paciente</h2>
  <p>En cualquier momento puede ejercer sus derechos de <strong>acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad</strong> dirigiéndose por escrito al responsable del tratamiento. También tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (<em>aepd.es</em>).</p>

  <h2>Declaración de Consentimiento</h2>
  <p>Yo, <strong>${p.nombre}</strong>, con DNI/NIE <strong>${p.dni}</strong>, declaro haber sido informado/a de manera clara y comprensible sobre el tratamiento de mis datos personales, y <strong>AUTORIZO EXPRESAMENTE</strong> dicho tratamiento para las finalidades descritas en el presente documento.</p>

  <div class="firma-bloque">
    <div><div class="firma-linea">Firma del/la Paciente<br>${p.nombre}<br>Fecha: ___ / ___ / ______</div></div>
    <div><div class="firma-linea">Firma del Psicólogo/a<br>Jaime<br>Fecha: ___ / ___ / ______</div></div>
  </div>
  <div class="legal">PsicoJaime · Conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD)</div>`
  return base('#1e3a6e', '#f0f4fb', `Autorización RGPD – ${p.nombre}`, body)
}

export function generarConsentimiento(p) {
  const body = `
  <h1>CONSENTIMIENTO INFORMADO PARA TRATAMIENTO PSICOLÓGICO</h1>
  <h2>Datos del/la Paciente</h2>
  <div class="campo"><strong>Nombre:</strong> ${p.nombre} &nbsp;|&nbsp; <strong>DNI/NIE:</strong> ${p.dni}</div>
  <div class="campo"><strong>Fecha nacimiento:</strong> ${p.fechaNacimiento} &nbsp;|&nbsp; <strong>Teléfono:</strong> ${p.telefono}</div>
  <div class="campo"><strong>Motivo de consulta:</strong> ${p.motivoConsulta || 'No especificado'}</div>
  <div class="campo"><strong>Diagnóstico provisional:</strong> ${p.diagnosis || 'Pendiente de evaluación'}</div>

  <h2>Datos del Profesional</h2>
  <p><strong>Psicólogo/a:</strong> Jaime &nbsp;|&nbsp; <strong>Consulta:</strong> PsicoJaime – Psicología Online<br>
  <strong>Número de colegiado:</strong> ______________________________<br>
  <strong>Orientación terapéutica:</strong> ______________________________<br>
  <strong>Modalidad:</strong> Sesiones individuales online (videollamada)</p>

  <h2>Naturaleza del Tratamiento</h2>
  <p>La psicoterapia es un proceso de tratamiento basado en la relación terapéutica. Implica trabajar de forma colaborativa para identificar y modificar patrones de pensamiento, emoción y comportamiento que generan malestar o limitan el funcionamiento del/la paciente.</p>

  <h2>Procedimiento</h2>
  <ul>
    <li>Sesiones de aproximadamente <strong>50 minutos</strong> de duración.</li>
    <li>Realizadas mediante <strong>videollamada</strong> en plataforma confidencial y segura.</li>
    <li>Frecuencia habitual: <strong>semanal o quincenal</strong>, según acuerdo terapéutico.</li>
    <li>El número de sesiones dependerá de la evolución y los objetivos acordados.</li>
    <li>El/la terapeuta podrá proponer tareas entre sesiones para reforzar el trabajo.</li>
  </ul>

  <h2>Beneficios Esperados</h2>
  <p>Reducción del malestar emocional, mejora de las relaciones interpersonales, mayor autoconocimiento, desarrollo de habilidades de afrontamiento y mejora general del bienestar psicológico.</p>

  <h2>Riesgos y Limitaciones</h2>
  <p>En ocasiones el proceso puede generar incomodidad temporal al abordar temas difíciles. La psicoterapia no garantiza resultado en todos los casos y puede no ser adecuada en determinadas situaciones clínicas. Estos aspectos serán abordados abiertamente en el proceso terapéutico.</p>

  <h2>Confidencialidad y sus Límites</h2>
  <p>Toda la información compartida en sesión es <strong>estrictamente confidencial</strong>. Solo podrá romperse en los siguientes casos previstos por la ley:</p>
  <ul>
    <li>Riesgo grave e inminente para la vida del/la paciente u otras personas.</li>
    <li>Requerimiento judicial mediante resolución firme.</li>
    <li>Obligación legal de comunicación a autoridades sanitarias o judiciales.</li>
  </ul>

  <h2>Honorarios y Cancelaciones</h2>
  <p><strong>Precio por sesión:</strong> _______ € &nbsp;|&nbsp; <strong>Forma de pago:</strong> ______________________________<br>
  Las cancelaciones deben realizarse con al menos <strong>24 horas de antelación</strong>. Las cancelaciones sin aviso previo podrán ser facturadas en su totalidad.</p>

  <h2>Voluntariedad</h2>
  <p>La participación es completamente <strong>voluntaria</strong>. El/la paciente puede interrumpir el tratamiento en cualquier momento, siendo recomendable comunicarlo al terapeuta para facilitar un cierre terapéutico adecuado.</p>

  <h2>Declaración de Consentimiento</h2>
  <p>Yo, <strong>${p.nombre}</strong>, con DNI/NIE <strong>${p.dni}</strong>, declaro:</p>
  <ul>
    <li>Haber leído y comprendido la información contenida en este documento.</li>
    <li>Haber podido formular preguntas, que han sido resueltas satisfactoriamente.</li>
    <li>Tomar la decisión de iniciar el tratamiento de forma <strong>libre y voluntaria</strong>.</li>
  </ul>
  <p>Y por ello <strong>CONSIENTO EXPRESAMENTE</strong> iniciar el proceso terapéutico con Jaime bajo las condiciones descritas.</p>

  <div class="firma-bloque">
    <div><div class="firma-linea">Firma del/la Paciente<br>${p.nombre}<br>Fecha: ___ / ___ / ______</div></div>
    <div><div class="firma-linea">Firma del Psicólogo/a<br>Jaime<br>Fecha: ___ / ___ / ______</div></div>
  </div>
  <div class="legal">PsicoJaime · Ley 41/2002 de autonomía del paciente · Código Deontológico del Consejo General de la Psicología de España</div>`
  return base('#1a5c3a', '#f0f7f3', `Consentimiento Informado – ${p.nombre}`, body)
}

export function descargarDocumento(htmlContent, nombreArchivo) {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function previsualizarDocumento(htmlContent) {
  const w = window.open('', '_blank')
  if (w) { w.document.write(htmlContent); w.document.close() }
}
